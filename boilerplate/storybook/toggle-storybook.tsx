import React, { useState, useEffect } from "react";
import { DevSettings } from "react-native";
import { flags } from "../app/config/env";
import { loadString, saveString } from "../app/utils/storage";

/**
 * Toggle Storybook mode, in __DEV__ mode only.
 *
 * In non-__DEV__ mode, or when Storybook isn't toggled on,
 * renders its children.
 *
 * The mode flag is persisted in async storage, which means it
 * persists across reloads/restarts - this is handy when developing
 * new components in Storybook.
 */
export function ToggleStorybook(props) {
  const [StorybookUIRoot, setStorybookUIRoot] = useState<Element>();

  useEffect(() => {
    if (flags.storybooks) {
      // Load the storybook UI once
      setStorybookUIRoot(() => require("./storybook").StorybookUIRoot);
    }
  }, []);

  if (flags.storybooks) {
    return StorybookUIRoot ? <StorybookUIRoot /> : null;
  } else {
    return props.children;
  }
}
