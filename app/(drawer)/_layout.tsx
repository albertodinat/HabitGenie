import React from "react";
import { Drawer } from "expo-router/drawer";
import { Pressable, useColorScheme } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { auth } from "../../firebase.config";

export default function DrawerLayout({ children }: any) {
  const Name = auth.currentUser?.displayName;
  const colorScheme = useColorScheme();
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "#1C3F39",
        drawerInactiveTintColor: "#EEE7D3",
        drawerLabelStyle: {
          fontSize: 16,
        },
        drawerActiveBackgroundColor: "#EEE7D3",
        drawerStyle: { backgroundColor: "#1C3F39" },
      }}
    >
      <Drawer.Screen
        name="(Home)"
        options={{
          drawerLabel: "Home",
          title: "Welcome, " + (Name && Name.split(" ")[0]),
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerTintColor: "#EEE7D3",
          headerStyle: { backgroundColor: "#1C3F39" },
          headerRight: () => (
            <Link href="/(Screens)/Profile" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color="#EEE7D3"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="menu"
        options={{
          drawerLabel: "Menu",
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="wrench" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="aboutUs"
        options={{
          drawerLabel: "About Us",
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="warning" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
