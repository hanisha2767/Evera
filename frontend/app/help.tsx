import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HelpScreen() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
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
        <Text style={{ color: "#D1FAE5", fontSize: 18 }}>
          Support
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Help & Support
        </Text>

        <Text style={{ color: "#D1FAE5", marginTop: 5 }}>
          Find answers to common questions
        </Text>
      </View>

      {/* FAQ LIST */}
      <View style={{ padding: 15 }}>
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;

          return (
            <View
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: 15,
                marginBottom: 12,
                overflow: "hidden",
              }}
            >
              {/* QUESTION */}
              <TouchableOpacity
                onPress={() => toggle(index)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 15,
                }}
              >
                <Text style={{ fontWeight: "600", flex: 1 }}>
                  {item.question}
                </Text>

                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>

              {/* ANSWER */}
              {isOpen && (
                <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
                  <Text style={{ color: "gray", lineHeight: 20 }}>
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* CLEAN FOOTER */}
      <Text
        style={{
          textAlign: "center",
          color: "gray",
          marginBottom: 20,
        }}
      >
        More features coming soon 🚀
      </Text>
    </ScrollView>
  );
}

// ⭐ FAQ DATA
const faqData = [
  {
    question: "How are carbon emissions calculated?",
    answer:
      "Emissions are calculated using standard emission factors based on transport mode, weight, and distance.",
  },
  {
    question: "What does 'Record Emission' do?",
    answer:
      "It saves the calculated emission to your total and dashboard. Quick Estimate does not save it.",
  },
  {
    question: "How does offsetting work?",
    answer:
      "Offsetting allows you to compensate emissions by supporting environmental projects like tree planting or renewable energy.",
  },
  {
    question: "Why is my Green Score low?",
    answer:
      "Your score depends on how much of your emissions are offset. Higher offset = better score.",
  },
  {
    question: "Is my data saved permanently?",
    answer:
      "Currently, data is stored locally. Future updates may include cloud syncing.",
  },
];