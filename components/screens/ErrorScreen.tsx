import { Text, View } from "react-native";

interface ErrorScreenProps {
  message?: string;
}

const ErrorScreen = ({ message = "There seems to have been an error loading this page." }: ErrorScreenProps) => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2 bg-[#F2F2F2] dark:bg-[#111827]">
      <Text className="text-black dark:text-white text-lg">{message}</Text>
    </View>
  );
};

export default ErrorScreen;
