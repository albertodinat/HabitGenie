export default ({ config }) => ({
    ...config,
    expo: {
        name: "HabitTracker",
        slug: "HabitTracker",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.axzer0.HabitGenie",
            googleServicesFile: process.env.IOS_GOOGLE_SERVICES_JSON || "./GoogleService-Info.plist", // Dynamic path for iOS
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json", // Dynamic path for Android
            package: "com.team_carnage.habittracker",
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: "c812a858-d08e-4edd-866e-1d908789dba4",
            },
        },
    },
});