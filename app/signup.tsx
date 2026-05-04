import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useApp } from "./AppContext";

export default function SignupScreen() {
  const router = useRouter();
  const { setUser } = useApp();

  const [name, setName] = useState(""); // ✅ added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    // Basic validations
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      // Use the variable from your .env file
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true" // This skips the warning page
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
        setUser(data.user);
        setError("");
        alert("Account created successfully!");
        router.replace("/(tabs)/home");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Could not connect to server. Check your tunnel.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E9ECEF", padding: 20, justifyContent: "center" }}>

      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
        Create Account
      </Text>
      <Text style={{ color: "#6B7280", marginBottom: 30 }}>
        Join Evera and start your journey 🌱
      </Text>

      {/* Name ✅ NEW */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#20B486",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Ionicons name="person-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* Email */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#20B486",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Ionicons name="mail-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="hello@gmail.com"
          value={email}
          onChangeText={setEmail}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* Password */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#D1D5DB",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* Error */}
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {error}
        </Text>
      ) : null}

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignup}
        style={{
          backgroundColor: "#20B486",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Create Account →
        </Text>
      </TouchableOpacity>

      {/* Switch to Login */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <Text style={{ color: "#6B7280" }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={{ color: "#20B486", fontWeight: "600" }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}