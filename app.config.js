const config = {
  expo: {
    name: "ExpoBoilerplate",
    slug: "expo-boilerplate",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    backgroundColor: "#000000",
    scheme: "boilerplate",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.example.boilerplate",
      buildNumber: "1",
      usesAppleSignIn: true,
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: false,
        },
        CFBundleDisplayName: "Boilerplate",
      },
      config: {
        usesNonExemptEncryption: false,
      },
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryFileTimestamp",
            NSPrivacyAccessedAPITypeReasons: ["C617.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategorySystemBootTime",
            NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
          },
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
            NSPrivacyAccessedAPITypeReasons: ["E174.1"],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000",
      },
      package: "com.example.boilerplate",
      edgeToEdgeEnabled: true,
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"],
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "expo-web-browser",
      "expo-font",
      "expo-apple-authentication",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#000000",
          image: "./assets/splash-icon.png",
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        // Replace with your EAS project id after `eas init`.
        projectId: "REPLACE_WITH_EAS_PROJECT_ID",
      },
    },
    updates: {
      // Replace with your EAS Updates URL after `eas update:configure`.
      url: "https://u.expo.dev/REPLACE_WITH_EAS_PROJECT_ID",
    },
    runtimeVersion: "1.0.0",
    owner: "REPLACE_WITH_OWNER",
  },
};

export default config;
