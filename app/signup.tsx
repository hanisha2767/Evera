import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    // ✅ validations
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("Email must end with @gmail.com");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ✅ save user
    const user = {
      name,
      email,
      password,
    };

    try {
      if (Platform.OS === "web") {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify(user)
        );
      }

      setError("");
      alert("Account created successfully!");

      // ✅ go to login
      router.replace("/login");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#E9ECEF",
        padding: 20,
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20 }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#1F2937"
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Create Account
      </Text>

      <Text
        style={{
          color: "#6B7280",
          marginBottom: 30,
        }}
      >
        Join Evera and start your journey 🌱
      </Text>

      {/* Name */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#20B486",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
          backgroundColor: "white",
        }}
      >
        <Ionicons
          name="person-outline"
          size={20}
          color="#6B7280"
        />

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
          backgroundColor: "white",
        }}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color="#6B7280"
        />

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
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6B7280"
        />

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
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Create Account →
        </Text>
      </TouchableOpacity>

      {/* Switch to Login */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#6B7280" }}>
          Already have an account?{" "}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/login")}
        >
          <Text
            style={{
              color: "#20B486",
              fontWeight: "600",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}