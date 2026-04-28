import { ScrollView, Text, View } from "react-native";

export default function TermsScreen() {
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
        <Text style={{ color: "#D1FAE5", fontSize: 18 }}>
          Legal
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Terms & Conditions
        </Text>

        <Text style={{ color: "#D1FAE5", marginTop: 5 }}>
          Please read carefully
        </Text>
      </View>

      {/* CONTENT */}
      <View style={{ padding: 15 }}>
        
        {sections.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 15,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              {item.title}
            </Text>

            <Text style={{ color: "gray", lineHeight: 20 }}>
              {item.content}
            </Text>
          </View>
        ))}

        {/* ✅ MOVE FOOTER HERE */}
        <Text
          style={{
            textAlign: "center",
            color: "gray",
            marginTop: 10,
          }}
        >
          Last updated: April 2026
        </Text>

      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ⭐ TERMS CONTENT
const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By using this application, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use the app.",
  },
  {
    title: "2. Use of the App",
    content:
      "This app is intended for tracking and reducing carbon emissions. You agree to use it responsibly and not misuse the data or features.",
  },
  {
    title: "3. User Data",
    content:
      "We store your data securely on your device. Your personal information is not shared with third parties without your consent.",
  },
  {
    title: "4. Accuracy of Information",
    content:
      "Emission calculations are estimates based on standard factors and may not be 100% accurate.",
  },
  {
    title: "5. Limitation of Liability",
    content:
      "We are not responsible for any decisions made based on the information provided by this app.",
  },
  {
    title: "6. Updates",
    content:
      "We may update these Terms & Conditions at any time. Continued use of the app implies acceptance of the updated terms.",
  },
];