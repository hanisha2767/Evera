import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { useApp } from "../AppContext"; // ⭐ IMPORTANT

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  // ⭐ GLOBAL DATA (no hardcoding)
  const { totalEmission, totalOffset, greenScore } = useApp();

  const getStatus = () => {
    if (greenScore > 75) return "Excellent";
    if (greenScore > 40) return "Good";
    return "Needs Improvement";
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      
      {/* HEADER */}
      <View style={{ backgroundColor: "#16A34A", padding: 20, paddingTop: 60 }}>
        <Text style={{ color: "#D1FAE5", fontSize: 18 }}>Insights</Text>

        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "bold", marginTop: 10 }}>
          Insights
        </Text>

        <Text style={{ color: "#D1FAE5", marginTop: 5 }}>
          Track your carbon footprint
        </Text>
      </View>

      <View style={{ padding: 15 }}>
        
        {/* GREEN SCORE */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Green Score
          </Text>

          <View
            style={{
              marginTop: 20,
              width: 180,
              height: 180,
              borderRadius: 90,
              borderWidth: 10,
              borderColor: greenScore > 40 ? "#16A34A" : "#EF4444",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: greenScore > 40 ? "#16A34A" : "#EF4444",
              }}
            >
              {greenScore.toFixed(1)}
            </Text>
            <Text style={{ color: "gray" }}>/100</Text>
          </View>

          <Text style={{ marginTop: 15, fontWeight: "600" }}>
            {getStatus()}
          </Text>

          <View style={{ marginTop: 10 }}>
            <Text style={{ color: "#EF4444" }}>
              Total: {totalEmission.toFixed(2)} kg CO₂
            </Text>
            <Text style={{ color: "#16A34A" }}>
              Offset: {totalOffset.toFixed(2)} kg CO₂
            </Text>
          </View>
        </View>

        {/* BAR CHART */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>
          Emissions by Transport Mode
        </Text>

        <BarChart
          data={{
            labels: ["Road", "Rail", "Air", "Sea"],
            datasets: [
              {
                data: [0, 0, 0, 0], // ⭐ starts at 0 (can update later)
              },
            ],
          }}
          width={screenWidth - 30}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" kg"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#16A34A",
            labelColor: () => "#000",
          }}
          style={{
            borderRadius: 16,
            marginTop: 10,
          }}
        />

        {/* LINE CHART */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>
          Emissions Over Time
        </Text>

        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar"],
            datasets: [
              {
                data: [0, 0, 0], // ⭐ starts at 0
              },
            ],
          }}
          width={screenWidth - 30}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" kg"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#16A34A",
            labelColor: () => "#000",
          }}
          style={{
            borderRadius: 16,
            marginTop: 10,
          }}
        />

        {/* SUMMARY */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>
          Summary
        </Text>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <MaterialCommunityIcons name="calendar" size={24} />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 5 }}>
              0
            </Text>
            <Text style={{ color: "gray" }}>Total Shipments</Text>
          </View>

          <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />

          <View style={{ alignItems: "center", flex: 1 }}>
            <MaterialCommunityIcons name="chart-bar" size={24} />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 5 }}>
              0.0
            </Text>
            <Text style={{ color: "gray" }}>
              Avg per Shipment (kg)
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}