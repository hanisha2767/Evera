import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Google Auth
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    let storedUser;

    try {
      if (Platform.OS === "web") {
        storedUser = localStorage.getItem("user");
      } else {
        storedUser = await SecureStore.getItemAsync("user");
      }

      if (!storedUser) {
        setError("No account found. Please sign up first.");
        return;
      }

      const user = JSON.parse(storedUser);

      if (email !== user.email || password !== user.password) {
        setError("Invalid email or password");
        return;
      }

      setError("");
      router.replace("/(tabs)/home");
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

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1F2937",
          }}
        >
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
          <Text
            style={{
              color: "#20B486",
              fontWeight: "600",
            }}
          >
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
          backgroundColor: "white",
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
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

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
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginLeft: 10, flex: 1 }}
        />

        <Ionicons
          name="eye-off-outline"
          size={20}
          color="#6B7280"
        />
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
        onPress={handleLogin}
        style={{
          backgroundColor: "#20B486",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Sign In →
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text
        style={{
          textAlign: "center",
          color: "#6B7280",
          marginBottom: 15,
        }}
      >
        Or continue with
      </Text>

      {/* Google Button Centered */}
      <View
        style={{
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync()}
          style={{
            width: "70%",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            padding: 12,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <AntDesign name="google" size={18} />
          <Text style={{ marginLeft: 8 }}>Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}