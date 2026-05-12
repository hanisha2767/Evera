import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../AppContext";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export default function OffsetScreen() {
  const { totalEmission, totalOffset, addOffset, undoOffset } = useApp();

  const [lastOffsetId, setLastOffsetId] = useState<number | null>(null);

  const options: {
    title: string;
    desc: string;
    icon: IconName;
    color: string;
    bg: string;
    value: number;
  }[] = [
    {
      title: "Renewable Energy",
      desc: "Invest in solar, wind, or hydro power projects",
      icon: "weather-sunny",
      color: "#F59E0B",
      bg: "#FEF3C7",
      value: 20,
    },
    {
      title: "Afforestation",
      desc: "Plant trees to absorb CO₂ from atmosphere",
      icon: "leaf",
      color: "#10B981",
      bg: "#D1FAE5",
      value: 15,
    },
    {
      title: "Energy Efficiency",
      desc: "Upgrade to energy-efficient equipment",
      icon: "flash",
      color: "#3B82F6",
      bg: "#DBEAFE",
      value: 10,
    },
    {
      title: "Carbon Capture",
      desc: "Support carbon capture technology projects",
      icon: "cloud-check",
      color: "#8B5CF6",
      bg: "#EDE9FE",
      value: 25,
    },
  ];

  const handleOffset = async (value: number) => {
    const id = await addOffset(value);
    if (id) {
      setLastOffsetId(id);
      alert("Offset successfully logged!");
    }
  };

  const handleUndo = () => {
    if (lastOffsetId === null) return;
    undoOffset(lastOffsetId);
    setLastOffsetId(null);
  };

  const netEmission = Math.max(totalEmission - totalOffset, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      
      {/* HEADER */}
      <View style={{ backgroundColor: "#16A34A", padding: 20, paddingTop: 60 }}>
        <Text style={{ color: "#D1FAE5", fontSize: 18 }}>Offset</Text>

        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "bold", marginTop: 10 }}>
          Offset Emissions
        </Text>

        <Text style={{ color: "#D1FAE5", marginTop: 5 }}>
          Take action to reduce your carbon footprint
        </Text>
      </View>

      <View style={{ padding: 15 }}>
        
        {/* STATS */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ color: "gray" }}>Net Emissions</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {netEmission.toFixed(2)} kg
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ color: "gray" }}>Total Offset</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#16A34A" }}>
              {totalOffset.toFixed(2)} kg
            </Text>
          </View>
        </View>

        {/* UNDO BUTTON */}
        <TouchableOpacity
          onPress={handleUndo}
          disabled={lastOffsetId === null}
          style={{
            backgroundColor: lastOffsetId !== null ? "#16A34A" : "#E5E7EB",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Text style={{ color: lastOffsetId !== null ? "#fff" : "gray", fontWeight: "600" }}>
            Undo Last Action
          </Text>
        </TouchableOpacity>

        {/* OPTIONS */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>
          Offset Options
        </Text>

        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOffset(item.value)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 15,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <View
              style={{
                backgroundColor: item.bg,
                padding: 12,
                borderRadius: 12,
                marginRight: 12,
              }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={item.color}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>{item.title}</Text>
              <Text style={{ color: "gray" }}>{item.desc}</Text>
            </View>

            <Text style={{ color: "#16A34A", fontWeight: "600" }}>
              +{item.value} kg
            </Text>
          </TouchableOpacity>
        ))}

        {/* INFO */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 15,
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "600" }}>About Carbon Offsetting</Text>
          <Text style={{ color: "gray", marginTop: 5 }}>
            Carbon offsetting involves compensating for emissions by funding
            projects that reduce or remove CO₂ from the atmosphere.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}