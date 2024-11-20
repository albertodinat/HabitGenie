// CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, handlePress,ContainerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.6}
      className={` m-0 p-0 bg-primary rounded-full min-h-[62px] justify-center items-center ${ContainerStyles} ${isLoading ? 'opacity-70' : ''}`} 
      disabled={isLoading} 
    >
      <Text className={`text-primary font-semibold text-lg ${textStyles}`} >{title}</Text>
    </TouchableOpacity>
  );
};


export default CustomButton;
