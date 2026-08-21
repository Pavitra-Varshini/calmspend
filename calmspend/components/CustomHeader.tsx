import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "../src/theme/colors";

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

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.primary,
    elevation: 4,
    justifyContent: "center",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    ma
  },
  titleContainer: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    color: colors.textPrimary,
  },
  subTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    textAlign: "center",
    color: "#2E6F40",
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  rightIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    right: 20,
    alignItems: "center",
  },
  secondIconBtn: {
    marginRight: 15,
  },
});

export default CustomHeader;
