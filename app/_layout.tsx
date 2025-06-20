import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import React from "react";
import { useColorScheme } from "../components/useColorScheme";
import { Pressable, StatusBar } from "react-native";
import Colors from "../constants/Colors";
import { extendTheme, NativeBaseProvider } from "native-base";
import { DateProvider } from "./Contexts/GlobalDateContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(auth)',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <DateProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar backgroundColor="#1C3F39" barStyle="dark-content" />

        <NativeBaseProvider
          theme={extendTheme({
            colors: {},
          })}
        >
          <Stack>
            <Stack.Screen
              name="index"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="(drawer)"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="(Screens)/Profile"
              options={{
                headerShown: false,
                presentation: "card",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="(Screens)/PersonalInfo"
              options={{
                headerShown: false,
                presentation: "card",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="(Screens)/CreateHabit"
              options={{
                headerShown: false,
                presentation: "containedModal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="(Screens)/HabitDetails"
              options={{
                headerShown: false,
                presentation: "containedModal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="(Screens)/EditHabit"
              options={{
                headerShown: false,
                presentation: "containedModal",
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="(orthophonist)/Dashboard"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="(orthophonist)/Program"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            {/* <Stack.Screen name="(drawer)/(tabs)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="modalcopy"
              options={{
                presentation: "card",
                headerRight: () => (
                  <Link href="/modal" asChild>
                    <Pressable>
                      {({ pressed }) => (
                        <FontAwesome
                          name="info-circle"
                          size={25}
                          color={Colors[colorScheme ?? "light"].text}
                          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                        />
                      )}
                    </Pressable>
                  </Link>
                ),
              }}
            />
          </Stack>
        </NativeBaseProvider>
      </ThemeProvider>
    </DateProvider>
  );
}
