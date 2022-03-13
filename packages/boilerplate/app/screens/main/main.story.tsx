/*
* This file renders your screen's presentation inside Storybooks, 
* be mindful that inside storybooks you may not have access to the app's state and navigation 
* so if your screen depends on those to render correctly, pass a mock of these values via props to your presentation
*/
import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Presentation } from "./main-presentation"
import { SafeAreaProvider } from "react-native-safe-area-context"

declare var module

storiesOf("Screens", module)
  .add("Main", () => (
    <SafeAreaProvider>
      <Presentation />
    </SafeAreaProvider>
  ))
