import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";

const LoginView = ({ navigation, serverIpAddress }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = `http://${serverIpAddress}:6666`;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/login`, {
        email,
        password,
      });

      if (response.data.status === "success") {
        navigation.navigate("Home", { driverId: response.data.driverId });
      } else {
        Alert.alert("Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error logging in");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Waiting...</Text>
          </View>
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default LoginView;
