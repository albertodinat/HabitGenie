import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelperText, TextInput } from "react-native-paper";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { auth } from "../../firebase.config";
import { createUserWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);


  const handlePress = () => {
    setSignUpClicked(true);
    if (email.length && password.length) {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        console.log("User account created & signed in!");
        router.push("/(drawer)/(Home)/HomePage");
        setIsLoading(false);
        return res
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
          setEmailErrorMessage("That email address is already in use!")
          setEmailError(true)
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
          setEmailErrorMessage("That email address is invalid!")
          setEmailError(true)
        }
        if (error.code === "auth/weak-password") {
          setPasswordError(true)
          console.log("Weak Password");
          setPasswordErrorMessage("Weak Password!")

        }
        setIsLoading(false);
        console.log(error.code)
      });
    if (userCredential) {
      await updateProfile((userCredential as UserCredential).user, { displayName: name })
    }
  };

  return (
    <SafeAreaView className="h-full bg-[#1C3F39]">
      <View className="h-1/4 pl-4 pt-6">
        <View>
          <View className="h-9 w-7">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.replace("/(auth)/HeroPage");
              }}
            >
              <FontAwesome name="chevron-left" size={28} color={"#EEE7D3"} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text className="text-secondary text-2xl font-semibold my-2">
            Welcome,
          </Text>
          <Text className="text-secondary text-3xl font-bold my-2">
            Sign up!
          </Text>
        </View>
      </View>
      <View className="flex mt-4 p-4 bg-[#EEE7D3] w-full h-full rounded-t-[60px]">
        <View className="flex flex-col pt-8 items-center justify-center w-full gap-y-3">
          <TextInput
            label="User Name"
            value={name}
            onChangeText={(text) => setName(text)}
            mode="outlined"
            className="bg-secondary w-full"
            left={<TextInput.Icon icon="face-man" size={20} disabled />}
            theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
            placeholder="example@gmail.com"
            error={signUpClicked && name.trim() === ""}
          />
          <View className="w-full">
            <TextInput
              label="Email Id"
              value={email}
              onChangeText={(text) => setEmail(text)}
              mode="outlined"
              className="bg-secondary w-full"
              left={<TextInput.Icon icon="email" size={20} disabled />}
              theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
              placeholder="example@gmail.com"
              error={signUpClicked && email.trim() === ""}
            />
            {emailError && <HelperText type="error" visible={emailError} className="font-semibold">
              {emailErrorMessage}
            </HelperText>}
          </View>
          <View className="w-full">
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              mode="outlined"
              theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
              className="bg-secondary w-full"
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
              error={signUpClicked && password.trim() === ""}
              left={<TextInput.Icon icon="lock" size={20} disabled />}
              secureTextEntry={!showPass}
            />
            {passwordError && <HelperText type="error" visible={passwordError} className="font-semibold">
              {passwordErrorMessage}
            </HelperText>}
          </View>
          <CustomButton
            title="Sign Up"
            handlePress={handlePress}
            ContainerStyles={"w-full px-2 rounded-3xl mt-6"}
            textStyles={"text-secondary"}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
