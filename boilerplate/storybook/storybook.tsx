import React, { useEffect } from "react";
import { getStorybookUI, configure } from "@storybook/react-native";
import { initFonts } from "../app/theme/fonts";

declare let module;

configure(() => {
  require("./storybook-registry");
}, module);

const StorybookUI = getStorybookUI({
  port: 9001,
  host: "localhost",
  onDeviceUI: true,
  asyncStorage:
    require("../app/utils/storage/async-storage").AsyncStorage || null,
});

export function StorybookUIRoot() {
  useEffect(() => {
    (async () => {
      await initFonts(); // expo only
    })();
  }, []);

  return <StorybookUI />;
}
