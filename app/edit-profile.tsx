import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Load existing user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await SecureStore.getItemAsync("user");
        if (!data) return;

        const user = JSON.parse(data);
        setName(user.name || "");
        setEmail(user.email || "");
      } catch (e) {
        console.log("Error loading user");
      }
    };

    loadUser();
  }, []);

  // 🔹 Save changes
  const handleSave = async () => {
    setError("");
    setSuccess("");

    // validation
    if (!name || !email) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    try {
      const data = await SecureStore.getItemAsync("user");

      if (!data) {
        setError("User not found");
        return;
      }

      const user = JSON.parse(data);

      const updatedUser = {
        ...user,
        name,
        email,
      };

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(updatedUser)
      );

      setSuccess("Profile updated successfully");

      // optional: go back after save
      setTimeout(() => {
        router.back();
      }, 1000);

    } catch (e) {
      setError("Something went wrong");
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
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ color: "#D1FAE5", fontSize: 18 }}>
          Profile
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Edit Profile
        </Text>
      </View>

      {/* FORM */}
      <View style={{ padding: 15 }}>
        
        {/* NAME */}
        <Text style={{ fontWeight: "600", marginTop: 10 }}>
          Full Name
        </Text>

        <View style={inputBox}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>

        {/* EMAIL */}
        <Text style={{ fontWeight: "600", marginTop: 15 }}>
          Email
        </Text>

        <View style={inputBox}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        {/* ERROR */}
        {error ? (
          <Text style={{ color: "red", marginTop: 10 }}>
            {error}
          </Text>
        ) : null}

        {/* SUCCESS */}
        {success ? (
          <Text style={{ color: "green", marginTop: 10 }}>
            {success}
          </Text>
        ) : null}

        {/* BUTTON */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: "#16A34A",
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 🔹 style
const inputBox = {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginTop: 8,
};