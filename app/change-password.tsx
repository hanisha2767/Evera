import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    // 🔹 Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const storedUser = await SecureStore.getItemAsync("user");

      if (!storedUser) {
        setError("User not found");
        return;
      }

      const user = JSON.parse(storedUser);

      // 🔴 Check current password
      if (user.password !== currentPassword) {
        setError("Current password is incorrect");
        return;
      }

      // ✅ Update password
      const updatedUser = {
        ...user,
        password: newPassword,
      };

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(updatedUser)
      );

      setSuccess("Password updated successfully");

      // clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
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
          Account
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Change Password
        </Text>
      </View>

      {/* FORM */}
      <View style={{ padding: 15 }}>
        
        {/* CURRENT */}
        <View style={inputBox}>
          <TextInput
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        {/* NEW */}
        <View style={inputBox}>
          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        {/* CONFIRM */}
        <View style={inputBox}>
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          onPress={handleChangePassword}
          style={{
            backgroundColor: "#16A34A",
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Update Password
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 🔹 styles
const inputBox = {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
};