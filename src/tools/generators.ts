import { filesystem, GluegunToolbox, strings } from "gluegun"
import * as ejs from "ejs"
import { command, heading, pressHeading, p, warning } from "./pretty"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function showGeneratorHelp(toolbox: GluegunToolbox) {
  const inpress = ispressProject()
  const generators = inpress ? installedGenerators() : []

  pressHeading()
  heading("press Generators")
  p()
  p("When you create a new app with press CLI, it will install several generator")
  p("templates in the project folder under the `press/templates` folder.")
  p()
  heading("Commands")
  p()
  command("--list  ", "List installed generators", ["press g --list"])
  command(
    "--update",
    "Update installed generators. You can also use the 'press update X' format",
    ["press g --update", `press g model --update`, `press update model`, `press update --all`],
  )
  warning("          ⚠️  this erases any customizations you've made!")
  p()
  heading("Installed generators")
  p()
  if (inpress) {
    const longestGen = generators.reduce((c, g) => Math.max(c, g.length), 0)
    generators.forEach((g) => {
      command(g.padEnd(longestGen), `generates a ${g}`, [`press g ${g} Demo`])
    })
  } else {
    warning("⚠️  Not in an press project root. Go to your press project root to see generators.")
  }
}

export function updateGenerators(toolbox: GluegunToolbox) {
  const { parameters } = toolbox

  let generatorsToUpdate
  if (parameters.first) {
    // only update the specified one
    generatorsToUpdate = [parameters.first]
  } else {
    // update any available generators
    generatorsToUpdate = availableGenerators()
  }

  const changes = installGenerators(generatorsToUpdate)
  const distinct = (val, index, self) => self.indexOf(val) === index
  const allGenerators = changes.concat(generatorsToUpdate).filter(distinct).sort()

  heading(`Updated ${changes.length} generator${changes.length === 1 ? "" : "s"}`)
  allGenerators.forEach((g) => {
    if (changes.includes(g)) {
      heading(`  ${g} - updated`)
    } else {
      p(`  ${g} - no changes`)
    }
  })
}

export function ispressProject(): boolean {
  return filesystem.exists("./press") === "dir"
}

function pressDir() {
  const cwd = process.cwd()
  return filesystem.path(cwd, "press")
}

function appDir() {
  const cwd = process.cwd()
  return filesystem.path(cwd, "app")
}

function templatesDir() {
  return filesystem.path(pressDir(), "templates")
}

/**
 * Finds generator templates installed in the current project
 */
export function installedGenerators(): string[] {
  const { subdirectories, separator } = filesystem

  const generators = subdirectories(templatesDir()).map((g) => g.split(separator).slice(-1)[0])

  return generators
}

type GeneratorOptions = {
  name: string,
  props?: string[],
  navigators?: string[]
}

/**
 * Generates something using a template
 */
export function generateFromTemplate(generator: string, options: GeneratorOptions, toolbox:GluegunToolbox): string[] [] {
  const { find, path, dir, copy, separator } = filesystem
  const { pascalCase, kebabCase, pluralize, camelCase } = strings
  // console.log(options.props)
  const componentProps = options.props.length > 0 ? options.props.map(prop => ({ prop: prop.split(':')[0], type: prop.split(':')[1] })) : [{ prop: 'text', type: 'string' }]
  console.log(componentProps)
  // permutations of the name
  const pascalCaseName = pascalCase(options.name)
  const kebabCaseName = kebabCase(options.name)
  const camelCaseName = camelCase(options.name)

  // passed into the template generator
  const props = { camelCaseName, kebabCaseName, pascalCaseName, componentProps }

  // where are we copying from?
  const templateDir = path(templatesDir(), generator)
  // where are we copying to?
  let destinationDir
  destinationDir = generator != 'navigator' ? path(appDir(), pluralize(generator), kebabCaseName) : path(appDir(), 'navigation')
  // Where is the index?
  const indexFile = path(appDir(), pluralize(generator), 'index.ts')

  // find the files
  const files = find(templateDir, { matching: "*" })

  // create destination folder
  dir(destinationDir)

  // loop through the files
  const newFiles = files.map((templateFilename: string) => {
    // get the filename and replace `NAME` with the actual name
    let filename = templateFilename.split(separator).slice(-1)[0].replace("NAME", kebabCaseName)

    // strip the .ejs
    if (filename.endsWith(".ejs")) filename = filename.slice(0, -4)

    let destinationFile: string

    // if .ejs, run through the ejs template system
    if (templateFilename.endsWith(".ejs")) {
      // where we're going
      destinationFile = path(destinationDir, filename)

      // file-specific props
      const data = { props: { ...props, filename } }
      console.log(data)
      // read the template
      const templateContent = filesystem.read(templateFilename)

      // render the template
      const content = ejs.render(templateContent, data)

      // write to the destination file
      filesystem.write(destinationFile, content)
    } else {
      // no .ejs, so just direct copy
      destinationFile = path(destinationDir, filename)
      copy(templateFilename, destinationFile)
    }
    return destinationFile
  })

  const modifiedFiles = ((): string[] => {
    const modifiedFiles = []
    switch (true) {
      case generator === 'component':
        modifiedFiles.push(addToIndex(kebabCaseName, indexFile, toolbox, generator))
        modifiedFiles.push(addStory(kebabCaseName, toolbox, generator))
        break
      case generator === 'screen':
        modifiedFiles.push(addToIndex(kebabCaseName, indexFile, toolbox, generator))
        modifiedFiles.push(addStory(kebabCaseName, toolbox, generator))
        const [moreNewFiles, moreModifiedFiles] = generateFromTemplate('page', options, toolbox)
        modifiedFiles.push(...moreModifiedFiles)
        newFiles.push(...moreNewFiles)
        if (options.navigators) {
          const navigatorFiles = addToNavigators(pascalCaseName, options.navigators, toolbox)
          modifiedFiles.push(...navigatorFiles)
        }
        break
      default:
        p('This generator is following default case')
        p('Edit the scripts to include customizations')
        break
    }
    return modifiedFiles
  })()
  return [newFiles, modifiedFiles]
}

export function addToNavigators(pascalCaseName, navigators, toolbox) {
  const { path } = filesystem
  const { patching } = toolbox
  // import to add
  const importToAdd = `import { ${pascalCaseName} } from "../screens"\n`
  const indexFile = navigators.map(nav => {
    const navigatorPath = path(appDir(), 'navigation', nav + '-navigator.tsx')
    // Actually add the import
    if (!filesystem.exists(navigatorPath)) {
      const msg =
        `No '${navigatorPath}' file found. Can't import component to navigator.` +
        `Import your new component manually.`
      p(msg)
      process.exit(1)
    }
    patching.prepend(navigatorPath, importToAdd)
    return navigatorPath
  })
  return indexFile
}
export function addToIndex(kebabCaseName, indexFile, toolbox, generator) {
  const { patching } = toolbox

  // Export to add
  const exportToAdd = `export * from "./${kebabCaseName}/${kebabCaseName}-${generator}"\n`

  // Actually add the export
  if (!filesystem.exists(indexFile)) {
    const msg =
      `No '${indexFile}' file found. Can't export component.` +
      `Export your new component manually.`
    p(msg)
    process.exit(1)
  }
  patching.append(indexFile, exportToAdd)
  return indexFile
}

export function addStory(kebabCaseName, toolbox: GluegunToolbox, generator: string) {
  const { pluralize } = strings
  const { patching } = toolbox
  const storyPath = `./storybook/storybook-registry-${pluralize(generator)}.ts`
  // Add story
  patching.prepend(
    storyPath,
    `require("../app/${pluralize(generator)}/${kebabCaseName}/${kebabCaseName}.story")\n`,
  )
  return storyPath
}

/**
 * Directory where we can find press CLI generator templates
 */
function sourceDirectory(): string {
  return filesystem.path(__filename, "..", "..", "..", "boilerplate", "press", "templates")
}

/**
 * Finds generator templates in press CLI
 */
export function availableGenerators(): string[] {
  const { subdirectories, separator } = filesystem
  return subdirectories(sourceDirectory()).map((g) => g.split(separator).slice(-1)[0])
}

/**
 * Copies over generators (specific generators, or all) from press CLI to the project
 * press/templates folder.
 */
export function installGenerators(generators: string[]): string[] {
  const { path, find, copy, dir, cwd, separator, exists, read } = filesystem
  const sourceDir = sourceDirectory()
  const targetDir = path(cwd(), "press", "templates")

  if (!ispressProject()) {
    throw new Error("Not in an press root directory (can't find ./press folder)")
  }

  // for each generator type, copy it over to the press/templates folder
  const changedGenerators = generators.filter((gen) => {
    const sourceGenDir = path(sourceDir, gen)
    const targetGenDir = path(targetDir, gen)

    // ensure the directory exists
    dir(targetDir)

    // find all source files
    const files = find(sourceGenDir, { matching: "*" })

    // copy them over
    const changedFiles = files.filter((file) => {
      const filename = file.split(separator).slice(-1)[0]
      const targetFile = path(targetGenDir, filename)

      if (!exists(targetFile) || read(targetFile) !== read(file)) {
        copy(file, targetFile, { overwrite: true })
        return true
      } else {
        return false
      }
    })

    return changedFiles.length > 0
  })

  return changedGenerators
}
