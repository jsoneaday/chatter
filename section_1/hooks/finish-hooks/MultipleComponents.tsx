import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Text, StyleSheet, Pressable, View, TextInput } from "react-native";

export function Form() {
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setGreeting("Welcome, please enter a name");
  }, []);

  const clearText = () => {
    setName("");
    setGreeting("Name has been cleared");
  };

  const updateGreeting = useCallback(() => {
    setGreeting(`${name}`);
  }, [name]);

  const secondaryGreeting = useMemo(() => {
    return `Welcome to the app.`;
  }, [name]);

  const onChangeText = (text: string) => {
    setName(text);
  };

  return (
    <View style={styles.container}>
      <Message>What is your name?</Message>
      <TextInput
        autoFocus={true}
        style={styles.inputTxt}
        value={name}
        onChangeText={onChangeText}
      />
      <View style={styles.btnContainer}>
        <Button onPress={updateGreeting}>Update</Button>
        <Button onPress={clearText}>Clear</Button>
      </View>
      <Message>{secondaryGreeting}</Message>
      <Message>{greeting}</Message>
    </View>
  );
}

interface ButtonProps {
  onPress: () => void;
}

export function Button({ onPress, children }: ButtonProps & MessageProps) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text>{children}</Text>
    </Pressable>
  );
}

interface MessageProps {
  children: ReactNode;
}

export function Message({ children }: MessageProps) {
  return <Text style={styles.txt}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: 25,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  btn: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  inputTxt: {
    width: "100%",
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  txt: { fontSize: 30, marginBottom: 10 },
});
