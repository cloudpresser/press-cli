export { GluegunCommand, GluegunToolbox } from "gluegun"

export type CLIType = "press-classic" | "react-native-cli" | "expo-cli" | "create-react-native-app"

export type CLIOptions = {
  cli: CLIType
  template: string
}
