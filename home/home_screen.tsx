import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import BottomTabNavigator from "../components/bottom_tab_navigator";
import styles from "../styles/styles";

function HomeScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.viewStyle}>
        <BottomTabNavigator />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
