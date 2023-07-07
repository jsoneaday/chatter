import { StyleProp, ViewStyle, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { primary } from "../../theme/colors";
import * as ImagePicker from "expo-image-picker";

interface KeyboardToolBarProps {
  show: boolean;
  style: StyleProp<ViewStyle>;
  getImageFile: (uri: string) => void;
}

export default function KeyboardToolBar({
  show,
  style,
  getImageFile,
}: KeyboardToolBarProps) {
  const pickImageAsync = async () => {
    let fileResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true, // field must be true or else fails
      quality: 1,
    });

    if (!fileResult.canceled) {
      console.log("fileResult", fileResult);
      getImageFile(fileResult.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return show ? (
    <View style={style}>
      <Pressable onPress={pickImageAsync}>
        <Ionicons name="md-image-outline" size={24} color={primary()} />
      </Pressable>
    </View>
  ) : null;
}
