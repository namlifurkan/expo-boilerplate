import { useEffect, useState } from "react";
import * as Updates from "expo-updates";

const DEV_PREVIEW = false;

export function useOTAUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkedForUpdate, setCheckedForUpdate] = useState(
    __DEV__ && !DEV_PREVIEW
  );

  useEffect(() => {
    if (__DEV__ && !DEV_PREVIEW) return;

    if (__DEV__ && DEV_PREVIEW) {
      setIsUpdating(true);
      const timer = setTimeout(() => {
        setIsUpdating(false);
        setCheckedForUpdate(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    let cancelled = false;

    async function checkAndApply() {
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (cancelled) return;
        if (!isAvailable) {
          setCheckedForUpdate(true);
          return;
        }

        setIsUpdating(true);
        await Updates.fetchUpdateAsync();
        if (!cancelled) await Updates.reloadAsync();
      } catch {
        if (!cancelled) {
          setIsUpdating(false);
          setCheckedForUpdate(true);
        }
      }
    }

    checkAndApply();
    return () => {
      cancelled = true;
    };
  }, []);

  return { isUpdating, checkedForUpdate };
}
