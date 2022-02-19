import { GluegunToolbox } from "gluegun"
import { p, command, heading, warning, direction } from "../tools/pretty"
import {
  showGeneratorHelp,
  updateGenerators,
  installedGenerators,
  availableGenerators,
  generateFromTemplate,
} from "../tools/generators"
import { executeImports } from "../tools/importers"

module.exports = {
  alias: ["g", "generator", "generators"],
  description: "Generates components and other features from templates",
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    p()
    if (parameters.options.help || parameters.options.list) {
      // show help or list generators
      showGeneratorHelp(toolbox)
    } else if (parameters.options.update) {
      // update with fresh generators
      updateGenerators(toolbox)
    } else if (parameters.first) {
      // actually generate something
      generate(toolbox)
    } else {
      // catch-all, just show help
      showGeneratorHelp(toolbox)
    }
  },
}
export function commandParser(toolbox) {
  const { parameters, strings } = toolbox
  const generator = parameters.first.toLowerCase()
  const name = parameters.second
  let pascalName = strings.pascalCase(name)
  // avoid the my-component-component phenomenon
  const pascalGenerator = strings.pascalCase(generator)
  if (pascalName.endsWith(pascalGenerator)) {
    p(`Stripping ${pascalGenerator} from end of name`)
    p(
      `Note that you don't need to add ${pascalGenerator} to the end of the name -- we'll do it for you!`,
    )
    pascalName = pascalName.slice(0, -1 * pascalGenerator.length)
    command(`press generate ${generator} ${pascalName}`)
  }
  // Parse options
  const navigators = Object.keys(parameters.options)
    .filter((op) => (op.split(":")[0] = "navigators"))[0]
    ?.split(":")[1]
    ?.split(",")
  const props = Object.keys(parameters.options).filter((op) => op.split(":")[0] !== "navigators")
  return {
    name,
    pascalName,
    generator,
    props,
    navigators,
  }
}
function generate(toolbox: GluegunToolbox) {
  const generators = installedGenerators()

  // Parse command
  const { name, pascalName, generator, props } = commandParser(toolbox)
  if (!generators.includes(generator)) {
    warning(`⚠️  Generator "${generator}" isn't installed.`)
    p()

    if (availableGenerators().includes(generator)) {
      direction("Install the generator with:")
      p()
      command(`press generate ${generator} --update`)
      p()
      direction("... and then try again!")
    } else {
      direction("Check your spelling and try again")
    }

    return
  }

  // we need a name for this component
  if (!name) {
    return warning(`⚠️  Please specify a name for your ${generator}: press g ${generator} MyName`)
  }
  // okay, let's do it!
  p()
  const newFiles = generateFromTemplate(generator, { name: pascalName, props: props }, toolbox)
  heading(`Generated new files:`)
  newFiles.forEach((f) => p(f))
  const modifiedFiles = executeImports(toolbox)
  if (modifiedFiles.length > 0) {
    heading(`Updated files:`)
    modifiedFiles.forEach((f) => p(f))
  }
}
