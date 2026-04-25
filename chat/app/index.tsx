import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [text, setText] = useState();
  const pingBackend = async () => {
    const res = await fetch("http://192.168.1.3:4005/");
    const data = await res.json();
    console.log(data.msg);
    setText(data?.msg ? data.msg : "hello");
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        style={style.btn}
        onPress={() => {
          pingBackend();
        }}
      >
        <Text style={{ color: "#fff" }}>Ping Backend</Text>
      </Pressable>
      <Text style={{ color: "#000" }}>{text ?? "ss"}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  btn: {
    backgroundColor: "#aa4f21",
    padding: 16,
    color: "#fff",
    borderRadius: 10,
  },
});
