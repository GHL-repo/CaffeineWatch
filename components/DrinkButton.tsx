import { ActivityIndicator, Text, TouchableOpacity, Image } from "react-native";

const DrinkButton = ({
  title,
  icon,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    > 
       <Image
        source={icon}
        className="w-[50px] h-[50px]"
        style={{tintColor: "black"}}
        resizeMode="contain"
      />
      <Text className={`text-primary font-psemibold text-sm ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default DrinkButton;
