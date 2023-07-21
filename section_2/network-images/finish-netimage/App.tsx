import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";

export default function App() {
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    console.log("attempt file download");
    FileSystem.downloadAsync(
      `http://localhost:4001/v1/msg_image/${273}`,
      FileSystem.cacheDirectory + `image-${273}.jpg`,
      {
        headers: { Accept: "image/jpeg" },
      }
    )
      .then((response) => {
        console.log("saved uri", response.uri);
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
        <Text style={{ fontSize: 40 }}>No File yet</Text>
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
