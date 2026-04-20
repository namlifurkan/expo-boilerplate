import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Secure storage adapter for the Supabase client. Persists session tokens via
 * Keychain (iOS) / Keystore-backed EncryptedSharedPreferences (Android) instead
 * of plain AsyncStorage. Chunks payloads > 1900 bytes because Android Keystore
 * has a hard 2 KB per-key limit. On first read, migrates any pre-existing
 * AsyncStorage value so existing logged-in users do not get logged out by the
 * upgrade.
 */

const CHUNK_SIZE = 1900;
const META_SUFFIX = "__meta";
const CHUNK_SUFFIX = "__";

const isSecureStoreSupported =
  Platform.OS === "ios" || Platform.OS === "android";

interface ChunkMeta {
  chunks: number;
  length: number;
}

const metaKey = (key: string) => `${key}${META_SUFFIX}`;
const chunkKey = (key: string, index: number) =>
  `${key}${CHUNK_SUFFIX}${index}`;

async function readChunkedFromSecureStore(key: string): Promise<string | null> {
  const metaRaw = await SecureStore.getItemAsync(metaKey(key));
  if (!metaRaw) return null;

  let meta: ChunkMeta;
  try {
    meta = JSON.parse(metaRaw);
  } catch {
    return null;
  }
  if (typeof meta.chunks !== "number" || meta.chunks < 1) return null;

  const parts: string[] = [];
  for (let i = 0; i < meta.chunks; i++) {
    const part = await SecureStore.getItemAsync(chunkKey(key, i));
    if (part === null) return null;
    parts.push(part);
  }
  return parts.join("");
}

async function writeChunkedToSecureStore(
  key: string,
  value: string
): Promise<void> {
  await deleteChunkedFromSecureStore(key);

  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    chunks.push(value.slice(i, i + CHUNK_SIZE));
  }

  for (let i = 0; i < chunks.length; i++) {
    await SecureStore.setItemAsync(chunkKey(key, i), chunks[i]);
  }
  const meta: ChunkMeta = { chunks: chunks.length, length: value.length };
  await SecureStore.setItemAsync(metaKey(key), JSON.stringify(meta));
}

async function deleteChunkedFromSecureStore(key: string): Promise<void> {
  const metaRaw = await SecureStore.getItemAsync(metaKey(key));
  if (metaRaw) {
    try {
      const meta: ChunkMeta = JSON.parse(metaRaw);
      if (typeof meta.chunks === "number") {
        for (let i = 0; i < meta.chunks; i++) {
          await SecureStore.deleteItemAsync(chunkKey(key, i));
        }
      }
    } catch {
      // ignore corrupt meta
    }
  }
  await SecureStore.deleteItemAsync(metaKey(key));
}

export const secureStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    if (!isSecureStoreSupported) return AsyncStorage.getItem(key);

    try {
      const fromSecure = await readChunkedFromSecureStore(key);
      if (fromSecure !== null) return fromSecure;

      const fromAsync = await AsyncStorage.getItem(key);
      if (fromAsync !== null) {
        try {
          await writeChunkedToSecureStore(key, fromAsync);
          await AsyncStorage.removeItem(key);
        } catch (migrationError) {
          console.warn(
            "secureStorageAdapter: migration to SecureStore failed",
            migrationError
          );
        }
        return fromAsync;
      }
      return null;
    } catch (error) {
      console.warn("secureStorageAdapter.getItem failed:", error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isSecureStoreSupported) return AsyncStorage.setItem(key, value);

    try {
      await writeChunkedToSecureStore(key, value);
      await AsyncStorage.removeItem(key).catch(() => {});
    } catch (error) {
      console.warn("secureStorageAdapter.setItem failed:", error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    if (!isSecureStoreSupported) return AsyncStorage.removeItem(key);

    try {
      await deleteChunkedFromSecureStore(key);
      await AsyncStorage.removeItem(key).catch(() => {});
    } catch (error) {
      console.warn("secureStorageAdapter.removeItem failed:", error);
    }
  },
};
