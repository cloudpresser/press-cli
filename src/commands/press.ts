import { GluegunToolbox } from "gluegun"

module.exports = {
  description: "🔥 The Press CLI 🔥",
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters: { first },
      print: { error },
    } = toolbox

    if (first !== undefined) {
      error(`press '${first}' is not a command`)
    } else {
      return require("./help").run(toolbox)
    }
  },
}
