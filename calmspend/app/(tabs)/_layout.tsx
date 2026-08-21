import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import MaterialDesignIcons from "@expo/vector-icons/build/MaterialDesignIcons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import Entypo from "@expo/vector-icons/build/Entypo";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import Octicons from "@expo/vector-icons/build/Octicons";
import Ionicons from "@expo/vector-icons/build/Ionicons";

const TabIcon = ({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.tabItem}>
      <Text style={{ fontSize: focused ? 24 : 20 }}>{emoji}</Text>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? colors.tabBarActive : colors.tabBarInactive },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 12,
            paddingTop: 8,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Octicons
                size={28}
                name="home-fill"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Entypo size={28} name="bar-graph" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome6
                size={28}
                name="clover"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={28}
                name="chatbox-ellipses"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={28}
                name="settings-sharp"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: "center", justifyContent: "center", gap: 2 },
  tabLabel: { fontSize: 10, fontWeight: "600" },
});
