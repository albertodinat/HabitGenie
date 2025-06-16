import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { IoIosArrowBack } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const [signInClicked, setSignInClicked] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handlePress = () => {
    setSignInClicked(true);
    if (email.length && password.length) {
      handleSignIn();
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setInfoMessage(null);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const user = cred.user;
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          const role = snap.data()?.role;
          if (!role) {
            setInfoMessage('No role assigned yet');
            return;
          }
          if (role === 'orthophonist') {
            router.replace('/(orthophonist)/Dashboard');
          } else if (role === 'patient') {
            router.replace('/(patient)/Dashboard');
          } else {
            setInfoMessage('Unknown role');
          }
        } finally {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        alert("Wrong email or password");
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView className="h-full bg-[#1C3F39]">
      <View className="h-1/4 px-4 pt-6">
        <View>
          <View className="h-9 w-7">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.replace("/(auth)/HeroPage");
              }}
            >
              <FontAwesome
                name="chevron-left"
                size={28}
                color={"#EEE7D3"}
                disabled
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text className="text-secondary text-2xl font-semibold my-2">
            Welcome Back,
          </Text>
          <Text className="text-secondary text-3xl font-bold my-2">
            Log In!
          </Text>
        </View>
      </View>
      <View className="mt-4 p-4 bg-[#EEE7D3] w-full h-full rounded-t-[60px]">
        <View className="mt-8">
          {infoMessage && (
            <Text className="text-red-500 mb-2 text-center">{infoMessage}</Text>
          )}
          <TextInput
            label="Email Id"
            value={email}
            onChangeText={(text) => setEmail(text)}
            mode="outlined"
            className="my-2 bg-secondary"
            left={<TextInput.Icon icon="email" size={20} disabled />}
            theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
            placeholder="example@gmail.com"
            error={signInClicked && !email}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            mode="outlined"
            theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
            className="my-2 bg-secondary border-primary"
            right={
              showPass ? (
                <TextInput.Icon
                  icon="eye-off"
                  size={20}
                  onPress={() => {
                    setShowPass(false);
                  }}
                />
              ) : (
                <TextInput.Icon
                  icon="eye"
                  size={20}
                  onPress={() => {
                    setShowPass(true);
                  }}
                />
              )
            }
            error={signInClicked && !password}
            left={<TextInput.Icon icon="lock" size={20} disabled />}
            secureTextEntry={!showPass}
          />
          <CustomButton
            title="Log In"
            handlePress={handlePress}
            ContainerStyles={"w-full px-2 rounded-3xl my-2"}
            textStyles={"text-secondary"}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
