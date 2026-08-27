import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/useTheme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface CustomHeaderProps {
  title: string;
  isBack?: boolean;
  isIcon?: boolean;
  iconName?: IoniconsName;
  onPress?: () => void;
  isLeftIcon?: boolean;
  leftIcon?: IoniconsName;
  onLeftBtnPress?: () => void;
  isSecondIcon?: boolean;
  secondIcon?: IoniconsName;
  onSecondIconPress?: () => void;
  subTitle?: string;
}

const CustomHeader = ({
  title,
  isIcon,
  onPress,
  iconName,
  isBack,
  isLeftIcon,
  leftIcon,
  onLeftBtnPress,
  isSecondIcon,
  secondIcon,
  onSecondIconPress,
  subTitle,
}: CustomHeaderProps) => {
  const router = useRouter();
  const { colors: C, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      // flexDirection: "row",
      // alignItems: "center",
      padding: 16,
      backgroundColor: C.primaryDark,
      elevation: 4,
      justifyContent: "center",
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      marginBottom: 10,
    },
    titleContainer: {
      alignItems: "flex-start",
      color: "white",
    },
    subTitle: {
      fontSize: 14,
      color: C.textSecondary,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      // textAlign: "center",
      color: C.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </View>
  );
};

export default CustomHeader;
