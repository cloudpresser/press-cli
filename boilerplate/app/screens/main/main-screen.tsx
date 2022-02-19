/*
* This file is responsible for rendering your screen inside the app.
* All functions should be defined in main-functions so they can be exported and tested!
* Treat this file as a container.
*/

import * as React from "react"
import { Presentation } from "./main-presentation"
import { MainProps } from "./main-interface"

export const Main = (props: MainProps) => {
  // Grab the props here!
  const { style, navigation } = props;

  return <Presentation style={style} />;
};
