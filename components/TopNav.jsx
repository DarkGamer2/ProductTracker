import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";

const TopNav = () => {
  return (
    <View style={styles.container}>
      <Text>Hello User!</Text>
      <Button title="Add" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default TopNav;
