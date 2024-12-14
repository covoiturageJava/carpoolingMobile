import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";

const HomeView = ({ route, navigation, serverIpAddress }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const driverId = route.params.driverId;
  const apiBaseUrl = `http://${serverIpAddress}:6666`;

  useEffect(() => {
    let active = true;

    const updateLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission denied");
        return;
      }

      try {
        const newLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (active) {
          const coords = newLocation.coords;
          console.log("Location Update:", coords);
          setLocation(coords);
          setLoading(false);
          try {
            await axios.post(`${apiBaseUrl}/location`, {
              driverId,
              longitude: coords.longitude,
              latitude: coords.latitude,
            });
            console.log("Location sent to server successfully.");
          } catch (serverError) {
            console.error("Error sending location to server:", serverError);
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    updateLocation();

    const id = setInterval(updateLocation, 60000);
    setIntervalId(id);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (intervalId) clearInterval(intervalId);
      await axios.post(`${apiBaseUrl}/remove-session`, {
        driverId,
      });
      console.log("Session removed from database.");

      await axios.post(`${apiBaseUrl}/logout`, { driverId });
      console.log("Driver logged out.");

      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error during logout process");
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading location...</Text>
          </View>
        ) : location ? (
          <Text style={styles.locationText}>
            Longitude: {location.longitude}, Latitude: {location.latitude}
          </Text>
        ) : (
          <Text style={styles.locationText}>Location not available</Text>
        )}

        <Button title="Logout" onPress={handleLogout} />
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
  content: {
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default HomeView;
