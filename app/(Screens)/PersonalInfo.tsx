import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from "react-native-paper";


const PersonalInfo = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [signUpClicked, setSignUpClicked] = useState(false);

    return (
        <SafeAreaView className='bg-primary h-full'>
            <View className='items-center justify-center h-full px-4 w-full'>
                <View className="mt-8 w-full">
                    <TextInput
                        label="Height"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        mode="outlined"
                        className="my-2 bg-secondary"
                        left={<TextInput.Icon icon="face-man" size={20} disabled />}
                        theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
                        placeholder="example@gmail.com"
                        error={signUpClicked && name.trim() === ""}
                    />
                    <TextInput
                        label="Weight"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        mode="outlined"
                        className="my-2 bg-secondary"
                        left={<TextInput.Icon icon="email" size={20} disabled />}
                        theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
                        placeholder="example@gmail.com"
                        error={signUpClicked && email.trim() === ""}
                    />
                    <TextInput
                        label="Gaand ka size(in gyaats)"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        mode="outlined"
                        theme={{ colors: { primary: "#1C3F39", outline: "#1C3F39" } }}
                        className="my-2 bg-secondary border-primary"
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PersonalInfo