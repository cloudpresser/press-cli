/*
* Your component must have a TypeScript interface. Use this file to create it
* Don't forget to add a brief JSDoc comment above all props. 
* Make sure to include all useful information inside your comment and to use JSDoc tags where necessary (deprecation, throwables, etc.)
*/
import { ViewStyle } from "react-native";

export interface MainProps {
  /**
  * Navigation object
  */
  navigation?: any
  /**
   * An optional style override useful for padding & margin
   */
  style?: ViewStyle
  
}

export interface MainPresentationProps {
  /**
   * An optional style override useful for padding & margin
   */
  style?: ViewStyle
  
}