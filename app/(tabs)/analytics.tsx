import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../AppContext";

export default function AnalyticsScreen() {
  // ⭐ UPDATED: added addEmission
  const { totalEmission, setTotalEmission, addEmission } = useApp();

  const [mode, setMode] = useState<"Road" | "Rail" | "Air" | "Sea">("Road");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const factors: Record<string, number> = {
    Road: 80,
    Rail: 15,
    Air: 550,
    Sea: 20,
  };

  const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    Road: "car",
    Rail: "train",
    Air: "airplane",
    Sea: "ferry",
  };

  const calculateEmission = () => {
    if (!weight || !distance) return;

    const w = parseFloat(weight);
    const d = parseFloat(distance);

    if (isNaN(w) || isNaN(d)) return;

    const emission = (w * d * factors[mode]) / 1000;
    setResult(emission);

    // ⭐ RECORD LOGIC (UPDATED)
    if (isRecording) {
      setTotalEmission((prev) => prev + emission);

      // ⭐ ADD TO HISTORY
      addEmission({
        type: mode,
        value: emission,
        date: new Date().toLocaleDateString(),
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
      
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#16A34A",
          padding: 20,
          paddingTop: 60,
        }}
      >
        <Text style={{ color: "#D1FAE5", fontSize: 18 }}>Calculate</Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Carbon Calculator
        </Text>

        <Text style={{ color: "#D1FAE5", marginTop: 5 }}>
          Calculate emissions from your shipments
        </Text>
      </View>

      <View style={{ padding: 15 }}>
        
        {/* MODE */}
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Mode</Text>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          
          <TouchableOpacity
            onPress={() => setIsRecording(false)}
            style={{
              flex: 1,
              backgroundColor: !isRecording ? "#A7F3D0" : "#E5E7EB",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
              marginRight: 10,
              borderWidth: 1,
              borderColor: "#16A34A",
            }}
          >
            <Text style={{ color: "#065F46", fontWeight: "600" }}>
              Quick Estimate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRecording(true)}
            style={{
              flex: 1,
              backgroundColor: isRecording ? "#A7F3D0" : "#E5E7EB",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#065F46", fontWeight: "600" }}>
              Record Emission
            </Text>
          </TouchableOpacity>
        </View>

        {/* TRANSPORT MODE */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 20 }}>
          Transport Mode
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {(["Road", "Rail", "Air", "Sea"] as const).map((item) => {
            const isActive = mode === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setMode(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isActive ? "#16A34A" : "#4B5563",
                  padding: 12,
                  borderRadius: 10,
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <MaterialCommunityIcons
                  name={icons[item]}
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={{ color: "#fff" }}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* INPUTS */}
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginTop: 10 }}>
          <TextInput
            placeholder="Weight (tons)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginTop: 10 }}>
          <TextInput
            placeholder="Distance (km)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={calculateEmission}
          style={{
            backgroundColor: "#16A34A",
            padding: 18,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="calculator" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Calculate
          </Text>
        </TouchableOpacity>

        {/* RESULT */}
        {result !== null && (
          <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 15, marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              Estimated Emission
            </Text>
            <Text style={{ fontSize: 26, fontWeight: "bold" }}>
              {result.toFixed(2)} kg CO₂
            </Text>
          </View>
        )}

        {/* TOTAL */}
        <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 15, marginTop: 20 }}>
          <Text style={{ fontSize: 16, color: "gray" }}>
            Total Recorded Emission
          </Text>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>
            {totalEmission.toFixed(2)} kg CO₂
          </Text>
        </View>

        {/* FACTORS */}
        <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 15, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
            Emission Factors (g CO₂/ton-km)
          </Text>

          {Object.entries(factors).map(([key, value]) => (
            <View
              key={key}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text>{key}</Text>
              <Text>{value} g/ton-km</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}