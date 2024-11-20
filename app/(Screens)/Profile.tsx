import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { auth, handleLogout } from "../../firebase.config";

const Profile = () => {
  const Name = auth.currentUser?.displayName;
  const Email = auth.currentUser?.email;
  const Colors = [
    "bg-[#F4E6FA]",
    "bg-[#F8F9DC]",
    "bg-[#FCFADB]",
    "bg-[#EEDCF8]",
    "bg-[#DFEAC9]",
    "bg-[#FFEEDD]",
    "bg-[#CCEFFF]",
    "bg-[#DFF5F3]",
    "bg-[#F7E6F3]",
    "bg-[#F6D8D0]",
  ];

  const renderName = () => {
    if (Name) {
      if (Name.split(" ").length === 1) {
        return Name[0][0];
      }
      return Name.split(" ")[0][0] + Name.split(" ")[1][0];
    }
    return "🤔";
  };

  return (
    <SafeAreaView className="h-full bg-primary items-center">
      {auth.currentUser && (
        <View className="flex items-center gap-y-2 w-full h-full ">
          {/* <Icon path={mdiLogout} size={1} /> */}
          <View className="flex flex-row justify-between items-center w-full px-4">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <MaterialIcons name="arrow-back-ios" size={28} color="#eee7d3" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleLogout();
              }}
            >
              <MaterialIcons name="logout" size={28} color="#eee7d3" />
            </TouchableOpacity>
          </View>
          <View
            className={`h-40 w-40 rounded-full border-4 border-white items-center justify-center ${
              Colors[Math.floor(Math.random() * 10)]
            }`}
          >
            <Text className="text-[60px] font-black text-primary">
              {renderName()}
            </Text>
          </View>
          <View className="flex items-center justify-center gap-y-1">
            <Text className="text-2xl text-secondary font-semibold">
              {Name}
            </Text>
            <Text className="text-base text-secondary italic">{Email}</Text>
          </View>
          <View className="w-full items-center justify-center h-1/2 px-4">
            <View className="flex items-center justify-center rounded-xl pt-1 bg-[#eee7d3] gap-y-2 border-4 border-secondary w-full px-1">
              <View className="flex flex-row justify-between items-center px-2 w-full py-2">
                <TouchableOpacity
                  className="flex flex-row justify-between items-center w-full h-full"
                  onPress={() => {
                    router.push("/(Screens)/PersonalInfo");
                  }}
                  activeOpacity={0.5}
                >
                  <View className="flex-row justify-center items-center gap-x-2">
                    <FontAwesome
                      name="user-circle"
                      size={28}
                      color={"#1C3F39"}
                    />
                    <Text className="text-base font-semibold">
                      Personal Information
                    </Text>
                  </View>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    color={"#1C3F39"}
                  />
                </TouchableOpacity>
              </View>
              <Divider className="bg-primary w-11/12 h-0.5" />
              <View className="flex flex-row justify-between items-center px-2 w-full py-2">
                <TouchableOpacity
                  className="flex flex-row justify-between items-center w-full h-full"
                  onPress={() => {
                    router.replace("/(Home)/HomePage");
                  }}
                  activeOpacity={0.5}
                >
                  <View className="flex-row justify-center items-center gap-x-2">
                    <FontAwesome
                      name="user-circle"
                      size={28}
                      color={"#1C3F39"}
                    />
                    <Text className="text-base font-semibold">
                      Personal Information
                    </Text>
                  </View>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    color={"#1C3F39"}
                  />
                </TouchableOpacity>
              </View>
              <Divider className="bg-primary w-11/12 h-0.5" />
              <View className="flex flex-row justify-between items-center px-2 w-full py-2">
                <View className="flex-row justify-center items-center gap-x-2">
                  <FontAwesome name="user-circle" size={28} color={"#1C3F39"} />
                  <Text className="text-base font-semibold">
                    Personal Information
                  </Text>
                </View>
                <FontAwesome name="chevron-right" size={20} color={"#1C3F39"} />
              </View>
              <Divider className="bg-primary w-11/12 h-0.5" />
              <View className="flex flex-row justify-between items-center px-2 pb-1 w-full py-2">
                <View className="flex-row justify-center items-center gap-x-2 pb-1">
                  <FontAwesome name="user-circle" size={28} color={"#1C3F39"} />
                  <Text className="text-base font-semibold">
                    Personal Information
                  </Text>
                </View>
                <FontAwesome name="chevron-right" size={20} color={"#1C3F39"} />
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;
