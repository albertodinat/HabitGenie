import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  View,
} from "react-native";

import Colors from "../../../constants/Colors";
import { useColorScheme } from "../../../components/useColorScheme";
import { useClientOnlyValue } from "../../../components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get("window");
  const isSmalliPhone = Platform.OS === "ios" && width <= 375 && height <= 667;
  const { width: screenWidth } = Dimensions.get("window");

  return (
    <View className="h-full bg-secondary pb-2">
      <StatusBar backgroundColor="#1C3F39" barStyle="light-content" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: false,
          tabBarStyle: {
            // backgroundColor:'#161632',
            // borderTopColor:'#232533',
            backgroundColor: "#1C3F39",
            height: 100,
            borderTopColor: "#1C3F39",
            borderRadius: isSmalliPhone || Platform.OS === "android" ? 20 : 50,
            borderColor: "#EEE7D3",
            paddingBottom: 20,
            padding:20,
            marginHorizontal:12,
            // width: screenWidth,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 10,
            shadowColor: "black",
          },
          tabBarLabelStyle: {
            fontSize: 16, // Change this to adjust title size
            fontWeight: "semibold", // Optional: add bold text
          },
        }}
      >
        <Tabs.Screen
          name="HomePage"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={30} color={color} />
            ),
            headerRight: () => (
              <Link href="/modalcopy" asChild>
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
            tabBarActiveTintColor: "#88D498",
            tabBarInactiveTintColor: "#EEE7D3",
          }}
        />
        <Tabs.Screen
          name="CalendarView"
          key="CalendarView"
          options={{
            title: "Activities",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="rocket" color={color} />
            ),
            tabBarActiveTintColor: "#88D498",
            tabBarInactiveTintColor: "#EEE7D3",
          }}
        />
      </Tabs>
    </View>
  );
}
