import { filesystem, GluegunToolbox, strings } from "gluegun"
import { commandParser } from "../commands/generate"
import { appDir } from "./generators"
import { p } from "./pretty"

export function addToNavigators(pascalCaseName, navigators, toolbox) {
  const { path } = filesystem
  const { patching } = toolbox
  // import to add
  const importToAdd = `import { ${pascalCaseName} } from "../screens"\n`
  const navigatorFiles = navigators
    ?.map((nav) => {
      const navigatorPath = path(appDir(), "navigation", nav + "-navigator.tsx")
      // Actually add the import
      if (!filesystem.exists(navigatorPath)) {
        const msg =
          `No '${navigatorPath}' file found. Can't import component to navigator.` +
          ` Import your new component manually.`
        p(msg)
        return null
      }
      patching.prepend(navigatorPath, importToAdd)
      return navigatorPath
    })
    .filter((f) => f !== null)
  return navigatorFiles || []
}
export function addToIndex(kebabCaseName, indexFile, toolbox: GluegunToolbox, generator) {
  const { patching } = toolbox
  // Export to add
  const exportToAdd = `export * from "./${kebabCaseName}/${kebabCaseName}-${generator}"\n`

  // Actually add the export
  if (!filesystem.exists(indexFile)) {
    const msg =
      `No '${indexFile}' file found. Can't export component.` +
      ` Export your new component manually.`
    p(msg)
    return
  }
  patching.append(indexFile, exportToAdd)
  return indexFile
}

export function addStory(kebabCaseName, toolbox: GluegunToolbox, generator: string) {
  const { find, path } = filesystem
  const { pluralize } = strings
  const { patching } = toolbox
  const generatorDir = path(appDir(), pluralize(generator))
  const storyIndex = find(generatorDir, {
    matching: "storybook-registry.@(ts|tsx|js|jsx)",
    recursive: false,
  })[0]
  // Actually add the export
  if (!storyIndex || !filesystem.exists(storyIndex)) {
    const msg =
      `No '${
        generatorDir + "/storybook-registry.@(ts|tsx|js|jsx)"
      }' file found. Can't export component.` + ` Export your new component manually.`
    p(msg)
    return
  }
  patching.prepend(storyIndex, `require("./${kebabCaseName}/${kebabCaseName}.story")\n`)
  return storyIndex
}
export const executeImports = (toolbox) => {
  const { pascalCase, kebabCase, pluralize } = strings
  const { path } = filesystem
  // Get options from command
  const { name, generator, navigators } = commandParser(toolbox)
  // permutations of the name
  const pascalCaseName = pascalCase(name)
  const kebabCaseName = kebabCase(name)
  // Where is the index?
  const indexFile = path(appDir(), pluralize(generator), "index.ts")
  console.log(indexFile)
  const modifiedFiles = [
    addToIndex(kebabCaseName, indexFile, toolbox, generator),
    addStory(kebabCaseName, toolbox, generator),
    ...addToNavigators(pascalCaseName, navigators, toolbox),
  ]
  return modifiedFiles.filter((f) => f !== null)
}
