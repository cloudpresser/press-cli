import { GluegunToolbox } from "../types"
import { spawnProgress } from "../tools/spawn"
import { packager } from "../tools/packager"
import { p, heading, direction, pressHeading, command } from "../tools/pretty"
import { PluginInstallManager } from "../tools/installPlugin"

export default {
  run: async (toolbox: GluegunToolbox) => {
    const { print, filesystem, system, meta, parameters, strings } = toolbox
    const { kebabCase } = strings
    const { path } = filesystem
    const { info, colors } = print
    const { gray, red, magenta, cyan, yellow } = colors

    // start tracking performance
    const perfStart = new Date().getTime()

    // retrieve project name from toolbox
    const { validateProjectName } = require("../tools/validations")
    const projectName = validateProjectName(toolbox)
    const projectNameKebab = kebabCase(projectName)

    // if they pass in --boilerplate, warn them to use old press
    const bname = parameters.options.b || parameters.options.boilerplate
    if (bname) {
      p()
      p(yellow(`Different boilerplates are no longer supported in press v4+.`))
      p(gray(`To use the old CLI to support different boilerplates, try:`))
      p(cyan(`npx press-cli@3 new ${projectName} --boilerplate ${bname}`))
      process.exit(1)
    }

    // debug?
    const debug = Boolean(parameters.options.debug)
    const log = (m) => {
      if (debug) info(m)
      return m
    }
    const utils = {
      spawnProgress, 
      log, 
      projectName, 
      projectNameKebab, 
      process, 
      filesystem, 
      packager,
      p,
      path
    }
    const pluginList = ["@cloudpresser/press-template"]
    const pluginInstallManager = new PluginInstallManager(pluginList, toolbox, utils)
    
    // welcome everybody!
    p("\n")
    pressHeading()
    p(` █ Creating ${magenta(projectName)} using ${cyan("press cli")} ${meta.version()}`)
    p(` █ Powered by ${cyan("CloudPresser")} - https://cloudpresser.com`)
    p(` █ Using ${red(pluginInstallManager.getPrettyNames())}`)
    p(` ────────────────────────────────────────────────\n`)
    p(`🔥 Pressing app`)

    await pluginInstallManager.installAll()

    // note the original directory
    const cwd = log(process.cwd())

    // commit any changes
    if (parameters.options.git !== false) {
      p(`🗄  Backing everything up in source control`)
      await system.run(
        log(`
          \\rm -rf ./.git
          git init;
          git add -A;
          git commit -m "New press ${meta.version()} app";
        `),
      )
    }

    // back to the original directory
    process.chdir(log(cwd))
    toolbox.print.spin
    // we're done! round performance stats to .xx digits
    const perfDuration = Math.round((new Date().getTime() - perfStart) / 10) / 100

    p()
    p()
    heading(`${red("press CLI")} pressd ${yellow(projectName)} in ${gray(`${perfDuration}s`)}`)
    p()
    direction(`To get started:`)
    pluginInstallManager.getGetStartedStrings().map(cm=>command(cm))
    p()
    heading("Now get cooking! 🍽")
    pressHeading()
  },
}
