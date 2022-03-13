/*
* This file is responsible for how your screen looks.
* Be mindful that inside storybooks you may not have access to the app's state and navigation 
* Treat this file as a component, it should not have any logic in it.
* All functions and values should be passed to this screen via props so they can be mocked for testing.
*/
import * as React from "react";
import { StatusBar, View, Text, Image } from "react-native";
import { translate } from "../../i18n";
import { color } from "../../theme";
import { MainPresentationProps } from "./main-interface"

export const Presentation = ({ style }:MainPresentationProps) => {
  return (
  <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <StatusBar barStyle="light-content" />
      <Image source={require("../../../assets/logo.png")} />
      <Text style={{ fontSize: 20, textAlign: "center" }}>
        {translate("press.open")}
        {" \n"}
        <Text style={{ backgroundColor: color.dim, color: color.text }}>
          /app/screens/Main-presentation.tsx
        </Text>
        {" \n"}
        {translate("press.toStartEditing")}
      </Text>
    </View>
  )
}
