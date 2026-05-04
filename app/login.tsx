import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useApp } from "./AppContext";

// ✅ Google Auth
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ added
  const [error, setError] = useState("");

  // ✅ Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_WEB_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
  });

  // ✅ Handle Google login
  useEffect(() => {
    if (response?.type === "success") {
      router.replace("/(tabs)/home");
    }
  }, [response]);

  // ✅ LOGIN FUNCTION (main fix)
  const handleLogin = async () => {
    try {
      // Use the variable from your .env file
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true" // This skips the warning page
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
        setUser(data.user);
        setError("");
        alert("Login successful!");
        router.replace("/(tabs)/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Could not connect to server. Check your tunnel.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E9ECEF", padding: 20, justifyContent: "center" }}>

      {/* Logo */}
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <View
          style={{
            backgroundColor: "#20B486",
            width: 70,
            height: 70,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons name="leaf-outline" size={32} color="white" />
        </View>

        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1F2937" }}>
          Evera
        </Text>
        <Text style={{ color: "#6B7280", marginTop: 5 }}>
          Your journey to zero starts here.
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#D1D5DB",
          borderRadius: 30,
          padding: 4,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/signup")}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#20B486", fontWeight: "600" }}>
            Sign Up
          </Text>
        </TouchableOpacity>
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
          marginBottom: 5,
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

      {/* Error */}
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {error}
        </Text>
      ) : null}

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
          value={password} // ✅ added
          onChangeText={setPassword} // ✅ added
          style={{ marginLeft: 10, flex: 1 }}
        />
        <Ionicons name="eye-off-outline" size={20} color="#6B7280" />
      </View>

      {/* Forgot Password */}
      <Text
        style={{
          textAlign: "right",
          color: "#20B486",
          marginBottom: 20,
        }}
      >
        Forgot Password?
      </Text>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleLogin} // ✅ updated
        style={{
          backgroundColor: "#20B486",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Sign In →
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={{ textAlign: "center", color: "#6B7280", marginBottom: 15 }}>
        Or continue with
      </Text>

      {/* Social Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

        {/* Google */}
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync()}
          style={{
            flex: 1,
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            padding: 12,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <AntDesign name="google" size={18} />
          <Text style={{ marginLeft: 8 }}>Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            padding: 12,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="logo-apple" size={18} />
          <Text style={{ marginLeft: 8 }}>Apple</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}