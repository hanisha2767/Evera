import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../AppContext";

export default function LeaderboardScreen() {
  const { totalOffset, history } = useApp();

  // ✅ Dynamic Badges
  const badges: {
  title: string;
  description: string;
  icon: string;
  color: string;
  }[] = [];
  if (history.length >= 1) {
    badges.push({
      title: "Eco Starter",
      description: "Completed first eco activity",
      icon: "leaf-outline",
      color: "#16A34A",
    });
  }

  if (history.length >= 5) {
    badges.push({
      title: "Logistics Explorer",
      description: "Tracked multiple shipments",
      icon: "navigate-outline",
      color: "#3B82F6",
    });
  }

  if (totalOffset >= 100) {
    badges.push({
      title: "Offset Hero",
      description: "Offset more than 100kg CO₂",
      icon: "shield-checkmark-outline",
      color: "#10B981",
    });
  }

  // ✅ Certifications
  const certifications = [
    {
      title: "Carbon Neutral Certified",
      issuer: "Evera Academy",
      year: "2026",
    },
    {
      title: "Sustainable Logistics Expert",
      issuer: "Evera Academy",
      year: "2026",
    },
    {
      title: "Eco Logistics Excellence",
      issuer: "Evera Academy",
      year: "2026",
    },
  ];

  // ✅ REPORT DOWNLOAD
  const generateMonthlyReport = async () => {
    try {
      const currentDate = new Date();

      const html = `
        <html>
          <body style="font-family: Arial; padding: 30px;">
            <h1 style="color: #16A34A; text-align: center;">
              Evera Sustainability Report
            </h1>

            <h2>User Monthly Summary</h2>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="border: 1px solid #ccc; padding: 12px;">
                  <b>Date</b>
                </td>

                <td style="border: 1px solid #ccc; padding: 12px;">
                  ${currentDate.toDateString()}
                </td>
              </tr>

              <tr>
                <td style="border: 1px solid #ccc; padding: 12px;">
                  <b>Total Shipments</b>
                </td>

                <td style="border: 1px solid #ccc; padding: 12px;">
                  ${history.length}
                </td>
              </tr>

              <tr>
                <td style="border: 1px solid #ccc; padding: 12px;">
                  <b>Total Offset</b>
                </td>

                <td style="border: 1px solid #ccc; padding: 12px;">
                  ${totalOffset.toFixed(2)} kg CO₂
                </td>
              </tr>
            </table>

            <h2 style="margin-top: 40px;">
              Unlocked Badges
            </h2>

            <ul>
              ${badges
                .map(
                  (badge) => `
                    <li>
                      <b>${badge.title}</b> - ${badge.description}
                    </li>
                  `
                )
                .join("")}
            </ul>

            <h2 style="margin-top: 40px;">
              Certifications
            </h2>

            <ul>
              ${certifications
                .map(
                  (cert) => `
                    <li>
                      <b>${cert.title}</b> - ${cert.issuer}
                    </li>
                  `
                )
                .join("")}
            </ul>

            <h3 style="margin-top: 40px; color: #16A34A;">
              Keep building a greener future 🌱
            </h3>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F3F4F6",
      }}
    >
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#16A34A",
          padding: 20,
          paddingTop: 60,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
      >
        <Text
          style={{
            color: "#D1FAE5",
            fontSize: 18,
          }}
        >
          Leaderboard
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Achievements 🏆
        </Text>

        <Text
          style={{
            color: "#D1FAE5",
            marginTop: 5,
          }}
        >
          Unlock badges and certifications
        </Text>
      </View>

      {/* BADGES */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginTop: 25,
          marginLeft: 15,
          color: "#111827",
        }}
      >
        Badges
      </Text>

      <View
        style={{
          paddingHorizontal: 15,
          marginTop: 15,
        }}
      >
        {badges.length === 0 ? (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "gray", fontSize: 16 }}>
              No badges unlocked yet 🌱
            </Text>
          </View>
        ) : (
          badges.map((badge, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 18,
                marginBottom: 15,
                flexDirection: "row",
                alignItems: "center",
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 35,
                  backgroundColor: badge.color,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={badge.icon as any}
                  size={32}
                  color="white"
                />
              </View>

              <View
                style={{
                  marginLeft: 15,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {badge.title}
                </Text>

                <Text
                  style={{
                    color: "#6B7280",
                    marginTop: 5,
                  }}
                >
                  {badge.description}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* CERTIFICATIONS */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginTop: 10,
          marginLeft: 15,
          color: "#111827",
        }}
      >
        Certifications
      </Text>

      <View
        style={{
          paddingHorizontal: 15,
          marginTop: 15,
        }}
      >
        {certifications.map((cert, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
              marginBottom: 15,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="verified"
                    size={24}
                    color="#16A34A"
                  />

                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#111827",
                      marginLeft: 8,
                      flex: 1,
                    }}
                  >
                    {cert.title}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#6B7280",
                    marginTop: 8,
                    marginLeft: 32,
                  }}
                >
                  Issued by {cert.issuer}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#DCFCE7",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: "#16A34A",
                    fontWeight: "700",
                  }}
                >
                  {cert.year}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* DOWNLOAD REPORT */}
      <TouchableOpacity
        onPress={generateMonthlyReport}
        style={{
          backgroundColor: "#16A34A",
          marginHorizontal: 15,
          marginTop: 10,
          marginBottom: 30,
          padding: 18,
          borderRadius: 18,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Download Monthly Report
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}