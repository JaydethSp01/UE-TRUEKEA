import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import ObjectListScreen from "../features/objects/screens/ObjectListScreen";
import SearchScreen from "../features/search/screens/SearchScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import ChatScreen from "../features/chat/screens/ChatScreen";
import RatingScreen from "../features/rating/screens/RatingScreen";
import PreferencesScreen from "../features/preferences/screens/PreferencesScreen";
import AdminScreen from "../features/admin/screens/AdminScreen";
import CO2Screen from "../features/co2/screens/CO2Screen";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Colors from "../constants/Colors";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, size, badgeCount }) => (
  <View style={{ position: "relative" }}>
    <Ionicons name={name} size={size} color={color} />
    {badgeCount > 0 && (
      <View style={{
        position: "absolute",
        right: -6,
        top: -3,
        backgroundColor: Colors.accent,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text style={{ color: Colors.white, fontSize: 10, fontWeight: "bold" }}>
          {badgeCount > 99 ? "99+" : badgeCount}
        </Text>
      </View>
    )}
  </View>
);

export default function BottomTabs() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: Colors.textDark,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-SemiBold",
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={ObjectListScreen}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Buscar" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "search" : "search-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="CO2" 
        component={CO2Screen}
        options={{
          title: "Impacto",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "leaf" : "leaf-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "chatbubbles" : "chatbubbles-outline"} color={color} size={size} badgeCount={3} />
          ),
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calificar" 
        component={RatingScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "star" : "star-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Preferencias" 
        component={PreferencesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "settings" : "settings-outline"} color={color} size={size} />
          ),
        }}
      />
      {user?.isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon name={focused ? "shield-checkmark" : "shield-checkmark-outline"} color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
