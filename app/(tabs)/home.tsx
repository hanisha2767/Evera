import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../AppContext";

export default function HomeScreen() {
  const router = useRouter();

  const {
    totalEmission,
    totalOffset,
    netEmission,
    greenScore,
    history,
    deleteEmission,
    resetAll,
  } = useApp();

  // ✅ DELETE
  const handleDelete = (item: any) => {
    if (item.id) {
      deleteEmission(item.id);
    }
  };

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

  return (
    <View style={{ flex: 1 }}>
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
          <Text style={{ color: "#D1FAE5", fontSize: 18 }}>Dashboard</Text>

          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Welcome Back!
          </Text>

          <Text style={{ color: "#D1FAE5", marginTop: 5 }}>
            Your Eco Journey 🌱
          </Text>
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
              title: "Total Emissions",
              value: `${totalEmission.toFixed(2)} kg`,
              icon: "trending-up",
              color: "#EF4444",
            },
            {
              title: "Total Offset",
              value: `${totalOffset.toFixed(2)} kg`,
              icon: "leaf",
              color: "#16A34A",
            },
            {
              title: "Net Emissions",
              value: `${netEmission.toFixed(2)} kg`,
              icon: "activity",
              color: "#F59E0B",
            },
            {
              title: "Green Score",
              value: `${greenScore.toFixed(0)}`,
              icon: "award",
              color: "#8B5CF6",
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
              <Feather name={item.icon as any} size={20} color={item.color} />

              <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>
                {item.value}
              </Text>

              <Text style={{ color: "gray", fontSize: 13 }}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 15 }}>
          Quick Actions
        </Text>

        <View
          style={{
            backgroundColor: "#fff",
            margin: 15,
            borderRadius: 15,
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/analytics")}
            style={{ alignItems: "center" }}
          >
            <Ionicons name="calculator-outline" size={28} color="#16A34A" />
            <Text style={{ marginTop: 5 }}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/offset")}
            style={{ alignItems: "center" }}
          >
            <Ionicons name="leaf-outline" size={28} color="#16A34A" />
            <Text style={{ marginTop: 5 }}>Offset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/leaderboard")}
            style={{ alignItems: "center" }}
          >
            <MaterialIcons name="leaderboard" size={28} color="#16A34A" />
            <Text style={{ marginTop: 5 }}>Leaderboard</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT EMISSIONS */}
        <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 15 }}>
          Recent Emissions
        </Text>

        {history.length === 0 ? (
          <Text style={{ marginLeft: 15, color: "gray", marginTop: 10 }}>
            No emissions recorded yet
          </Text>
        ) : (
          history.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#fff",
                marginHorizontal: 15,
                marginTop: 10,
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={
                    item.type === "Road"
                      ? "car-outline"
                      : item.type === "Rail"
                      ? "train-outline"
                      : item.type === "Air"
                      ? "airplane-outline"
                      : "boat-outline"
                  }
                  size={22}
                  color="gray"
                />

                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "600" }}>{item.type}</Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {item.date}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: "#EF4444", fontWeight: "600" }}>
                  {item.value.toFixed(2)} kg
                </Text>

                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Text style={{ color: "red", fontSize: 12 }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>


    </View>
  );
}