import { GluegunToolbox } from "gluegun"
import { showGeneratorHelp } from "../tools/generators"
import { p, command, heading, pressHeading, direction, link } from "../tools/pretty"

module.exports = {
  dashed: true,
  alias: ["h"],
  description: "Displays Press CLI help",
  run: async (toolbox: GluegunToolbox) => {
    const { meta, parameters } = toolbox

    p()

    // specific help -- generators
    if (
      parameters.second &&
      (parameters.second === "g" || parameters.second.startsWith("generat"))
    ) {
      return showGeneratorHelp(toolbox)
    }

    pressHeading()
    heading(`Welcome to Press ${meta.version()}!`)
    p()
    p("Press is a CLI that helps you spin up a new React Native app using a")
    p("battle-tested tech stack.")
    p()
    heading("Commands")
    p()
    command("new         ", "Creates a new React Native app", [
      "press new MyApp",
      "press new MyApp --expo",
    ])
    p()
    command("generate (g)", "Generates components and other app features", [
      "press generate --hello",
      "press generate component Hello",
      "press generate model User",
      "press generate screen Login",
    ])
    p()
    command(
      "doctor      ",
      "Checks your environment & displays versions of installed dependencies",
      ["press doctor"],
    )
    p()
    direction(
      `See the documentation: ${link("https://github.com/infinitered/press/tree/master/docs")}`,
    )
    p()
    direction(
      `If you need additional help, join our Slack at ${link("http://community.infinite.red")}`,
    )
    p()
    pressHeading()
  },
}
