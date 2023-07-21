import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as FileSystem from "expo-file-system";

export default function App() {
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    FileSystem.downloadAsync(
      `http://localhost:4001/v1/msg_image/${18}`,
      FileSystem.cacheDirectory + `msg-${18}.jpg`,
      {
        headers: { Accept: "image/jpeg" },
      }
    )
      .then((response) => {
        setImageUri(response.uri);
      })
      .catch((err) => {
        console.log("failed to get file", err);
      });
  }, []);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ height: 350, width: 350 }} />
      ) : (
        <Text style={{ fontSize: 40 }}>Has not loaded</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
