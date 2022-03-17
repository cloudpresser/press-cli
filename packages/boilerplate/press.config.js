module.exports = {
    pluginType: "boilerplate",
    installPlugin: async ({spawnProgress, projectName, projectNameKebab, process, filesystem, boilerplatePath, packager, path, reportProgress},) => {
        const log = (m) => {
            if (debug) info(m)
            return m
          }
        const cliString = `npx expo-cli init ${projectName} --template @cloudpresser/expo-template --non-interactive`
        
        // generate the project
        await spawnProgress(cliString, {
            env: { ...process.env, EXPO_DEBUG: 1 },
            onProgress: (out) => {
                out = out.toString()
                if (out.includes("Using Yarn")) reportProgress(.3)
                if (out.includes("project is ready")) reportProgress(.3)
            },
        })

        // jump into the project to do additional tasks
        process.chdir(projectName)

        // copy the .gitignore
        const gitPath = path(process.cwd(), ".gitignore")
        if (!filesystem.exists(gitPath)) {
            filesystem.copy(path(boilerplatePath, ".gitignore"), gitPath)
        }

        // Replace package.json strings
        let packageJsonRaw = filesystem.read("package.json")
        
        packageJsonRaw = packageJsonRaw
            .replace(/HelloWorld/g, projectName)
            .replace(/hello-world/g, projectNameKebab)
        
        const packageJson = JSON.parse(packageJsonRaw)
        
        filesystem.write("package.json", packageJson)

        // Install Deps
        reportProgress(.1)
        await packager.install({ onProgress: (log) })
        reportProgress(.3)
        // // Make sure all our modifications are formatted nicely
        // await spawnProgress("yarn format", {})
    },
    getStarted: ({projectName})=>[`  cd ${projectName}`, `  yarn start`],
    pluginName: "expo",
    scope: "mobile"
}