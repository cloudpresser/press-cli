import { GluegunToolbox } from "../types"
import { spawnProgress } from "../tools/spawn"
import { isAndroidInstalled } from "../tools/react-native"
import { packager } from "../tools/packager"
import { p, heading, command, direction, pressHeading } from "../tools/pretty"

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

    // expo or no?
    const expo = true
    const cli = expo ? "expo-cli" : "react-native-cli"
    const pressPath = path(`${meta.src}`, "..")
    const boilerplatePath = path(pressPath, "boilerplate")
    const cliEnv = expo && debug ? { ...process.env, EXPO_DEBUG: 1 } : process.env
    const cliString = expo
      ? `npx expo-cli init ${projectName} --template @cloudpresser/expo-template --non-interactive`
      : `npx react-native init ${projectName} --template file://${pressPath}${
          debug ? " --verbose" : ""
        }`

    log({ expo, cli, pressPath, boilerplatePath, cliString })

    // welcome everybody!
    p("\n")
    pressHeading()
    p(` █ Creating ${magenta(projectName)} using ${cyan("press")} ${meta.version()}`)
    p(` █ Powered by ${cyan("CloudPresser")} - https://cloudpresser.com`)
    p(` █ Using ${red(cli)}`)
    p(` ────────────────────────────────────────────────\n`)
    p(`🔥 Pressing app`)

    // generate the project
    await spawnProgress(log(cliString), {
      env: cliEnv,
      onProgress: (out: string) => {
        out = log(out.toString())
        if (expo) {
          if (out.includes("Using Yarn")) p(`🪔 Summoning Expo CLI`)
          if (out.includes("project is ready")) p(`🎫 Cleaning up Expo install`)
        } else {
          if (out.includes("Welcome to React Native!")) p(`🖨  3D-printing a new React Native app`)
          if (out.includes("Run instructions for")) p(`🧊 Cooling print nozzles`)
        }
      },
    })

    // note the original directory
    const cwd = log(process.cwd())

    // jump into the project to do additional tasks
    process.chdir(projectName)

    // copy the .gitignore if it wasn't copied over [expo...]
    const gitPath = log(path(process.cwd(), ".gitignore"))
    if (!filesystem.exists(gitPath)) {
      filesystem.copy(path(boilerplatePath, ".gitignore"), gitPath)
    }

    // Update package.json:
    // - We need to replace the app name in the detox paths. We do it on the
    //   unparsed file content since that's easier than updating individual values
    //   in the parsed structure, then we parse that as JSON.
    // - Having a "prepare" script in package.json messes up expo-cli init above
    //   (it fails because npm-run-all hasn't been installed yet), so we
    //   add it.
    // - If Expo, we also merge in our extra expo stuff.
    // - Then write it back out.
    let packageJsonRaw = filesystem.read("package.json")
    packageJsonRaw = packageJsonRaw
      .replace(/HelloWorld/g, projectName)
      .replace(/hello-world/g, projectNameKebab)
    const packageJson = JSON.parse(packageJsonRaw)

    // packageJson.scripts.prepare = "npm-run-all patch hack:*"
    // if (expo) {
    //   const merge = require("deepmerge-json")
    //   const expoJson = filesystem.read("package.expo.json", "json")
    //   packageJson = merge(packageJson, expoJson)
    // }
    filesystem.write("package.json", packageJson)

    // More Expo-specific changes
    if (expo) {
      // remove the ios and android folders
      // filesystem.remove("./ios")
      // filesystem.remove("./android")

      // rename the index.js to App.js, which expo expects;
      // update the reference to it in tsconfig, too
      // filesystem.rename("./index.js", "App.js")
      // await toolbox.patching.update("tsconfig.json", (config) => {
      //   config.include[0] = "App.js"
      //   return config
      // })

      // use Detox Expo reload file
      // filesystem.remove("./e2e/reload.js")
      // filesystem.rename("./e2e/reload.expo.js", "reload.js")

      // use Expo AsyncStorage file
      // filesystem.remove("./app/utils/storage/async-storage.ts")
      // filesystem.rename("./app/utils/storage/async-storage.expo.ts", "async-storage.ts")

      p(`🧶 Unboxing NPM dependencies`)
      await packager.install({ onProgress: log })

      // for some reason we need to do this, or we get an error about duplicate RNCSafeAreaProviders
      // see https://github.com/th3rdwave/react-native-safe-area-context/issues/110#issuecomment-668864576
      // await packager.add("react-native-safe-area-context", { expo: true })
    } else {
      // remove the Expo-specific files -- not needed
      filesystem.remove(`./bin/downloadExpoApp.sh`)
      filesystem.remove("./e2e/reload.expo.js")
      filesystem.remove("./app/utils/storage/async-storage.expo.ts")

      // install pods
      p(`☕️ Baking CocoaPods`)
      await spawnProgress("npx pod-install", {})
    }

    // remove the expo-only package.json
    // filesystem.remove("package.expo.json")

    // Make sure all our modifications are formatted nicely
    // await spawnProgress("yarn format", {})

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

    // we're done! round performance stats to .xx digits
    const perfDuration = Math.round((new Date().getTime() - perfStart) / 10) / 100

    p()
    p()
    heading(`${red("press CLI")} pressd ${yellow(projectName)} in ${gray(`${perfDuration}s`)}`)
    p()
    direction(`To get started:`)
    command(`  cd ${projectName}`)
    if (expo) {
      command(`  yarn start`)
    } else {
      if (process.platform === "darwin") {
        command(`  npx react-native run-ios`)
      }
      command(`  npx react-native run-android`)
      if (isAndroidInstalled(toolbox)) {
        p()
        direction("To run in Android, make sure you've followed the latest react-native setup")
        direction(
          "instructions at https://facebook.github.io/react-native/docs/getting-started.html",
        )
        direction(
          "before using press. You won't be able to run Android successfully until you have.",
        )
      }
    }
    // p()
    // p("Need additional help?")
    // p()
    // direction("Join our Slack community at http://community.infinite.red.")
    p()
    heading("Now get cooking! 🍽")
    pressHeading()
  },
}
