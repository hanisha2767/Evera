import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../AppContext";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ⭐ GLOBAL DATA
  const { totalEmission, totalOffset, history, resetAll } = useApp();

  const netEmission = Math.max(totalEmission - totalOffset, 0);

  const score = Math.max(
    100 - (netEmission / (totalEmission || 1)) * 100,
    0
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await SecureStore.getItemAsync("user");

        if (!data) {
          router.replace("/login");
          return;
        }

        setUser(JSON.parse(data));
      } catch (e) {
        console.log("Error loading user", e);
      }
    };

    loadUser();
  }, []);

  // ⭐ RESET WITH CONFIRMATION
  const handleReset = () => {
    Alert.alert(
      "Reset Data",
      "Are you sure you want to clear all emissions and offsets?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetAll,
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  
  const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("user");
          router.replace("/login");
        },
      },
    ]
  );
};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
      
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#16A34A",
          padding: 20,
          paddingTop: 60,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: "#22C55E",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "600" }}>
              {initials}
            </Text>
          </View>

          <View style={{ marginLeft: 15 }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
              {user.name || "User"}
            </Text>
            <Text style={{ color: "#E5E7EB" }}>
              {user.email || "No email"}
            </Text>
          </View>
        </View>

        {/* CARBON SCORE */}
        <View
          style={{
            marginTop: 20,
            backgroundColor: "rgba(255,255,255,0.15)",
            padding: 20,
            borderRadius: 15,
          }}
        >
          <Text style={{ color: "#D1FAE5" }}>Your Carbon Score</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "700" }}>
            {score.toFixed(0)} <Text style={{ fontSize: 16 }}>/100</Text>
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: 15,
          marginTop: 10,
        }}
      >
        {[
          {
            title: "Total Offset",
            value: `${totalOffset.toFixed(2)} kg`,
            icon: "leaf",
          },
          {
            title: "Trees Planted",
            value: `${Math.floor(totalOffset / 20)}`,
            icon: "trending-down",
          },
          {
            title: "Days Active",
            value: `${history.length}`,
            icon: "users",
          },
          {
            title: "Projects Supported",
            value: `${Math.floor(totalOffset / 25)}`,
            icon: "heart",
          },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              width: "48%",
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 15,
              marginBottom: 15,
              elevation: 2,
            }}
          >
            <Feather name={item.icon as any} size={20} color="#16A34A" />
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 10 }}>
              {item.value}
            </Text>
            <Text style={{ color: "gray", fontSize: 13 }}>
              {item.title}
            </Text>
          </View>
        ))}
      </View>

      {/* PROFILE CARD */}
      <View
        style={{
          backgroundColor: "#fff",
          margin: 15,
          borderRadius: 15,
          padding: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#16A34A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {initials}
            </Text>
          </View>

          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {user.name}
            </Text>
            <Text style={{ color: "gray" }}>
              {user.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/edit-profile")}
          style={{
            marginTop: 20,
            backgroundColor: "#16A34A",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* SETTINGS */}
      <View
        style={{
          backgroundColor: "#fff",
          marginHorizontal: 15,
          borderRadius: 15,
          padding: 10,
        }}
      >
        {[
          { title: "Change Password", icon: "lock-closed-outline", route: "/change-password" as const },
          { title: "Terms & Conditions", icon: "document-text-outline", route: "/terms" as const },
          { title: "Help & Support", icon: "help-circle-outline", route: "/help" as const },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 15,
              borderBottomWidth: index !== 2 ? 0.5 : 0,
              borderColor: "#ddd",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name={item.icon as any} size={20} />
              <Text style={{ marginLeft: 10 }}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </TouchableOpacity>
        ))}
      </View>

      {/* RESET DATA ⭐ */}
      <TouchableOpacity
        onPress={handleReset}
        style={{
          margin: 15,
          backgroundColor: "#16A34A",
          borderRadius: 15,
          padding: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Reset All Data
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginHorizontal: 15,
          borderWidth: 1,
          borderColor: "red",
          borderRadius: 15,
          padding: 15,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "red", fontWeight: "600" }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text
        style={{
          textAlign: "center",
          color: "gray",
          marginBottom: 20,
        }}
      >
        Evera v1.0.0 • Made with 💚 for a sustainable future
      </Text>
    </ScrollView>
  );
}