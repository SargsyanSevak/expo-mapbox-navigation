import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { MapboxNavigationView } from "expo-mapbox-navigation";
import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import * as ScreenOrientation from "expo-screen-orientation";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2FyZ3N5YW5zZXZhayIsImEiOiJjbWV3aHRkeTAwc2t0MnFzZDJ0eTE5bjdoIn0.XuoyLU-rFsTMUQMI0argtw"
);

export default function App() {
  const [locationAllowed, setLocationAllowed] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState(null);

  // Unlock screen orientation
  React.useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  // Request location permission and get current location
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationAllowed(true);
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setLocationAllowed(false);
      }
    })();
  }, []);

  // Destination: Santa Monica Pier
  const destination = { latitude: 34.0094, longitude: -118.4973 };
console.log({
  locationAllowed,
  currentLocation
});

React.useEffect(() => {
  (async () => {
    // Request foreground permission
    let { status: fgStatus } = await Location.requestForegroundPermissionsAsync();

    if (fgStatus !== "granted") {
      setLocationAllowed(false);
      return;
    }

    // Optional: request background permission on Android
    if (Platform.OS === "android") {
      let { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      console.log("Background location status:", bgStatus);
    }

    setLocationAllowed(true);

    // Small delay to let GPS initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get current location
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
     
      
    });

    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    console.log("Current location:", location.coords);
  })();
}, []);

  return (
    <View style={styles.container}>
      {locationAllowed && currentLocation ? (
        <MapboxNavigationView
          style={{ flex: 1 }}
          coordinates={[currentLocation, destination]}
          vehicleMaxHeight={5.0}
          vehicleMaxWidth={2.5}
        />
      ) : (
        <Text style={styles.text}>Location required for Mapbox navigation</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    alignSelf: "center",
  },
});
