module.exports = {
    pluginType: "boilerplate",
    installPlugin: async ({spawnProgress, projectName, projectNameKebab, process, filesystem, boilerplatePath, packager, path, reportProgress},) => {
        const log = (m) => {
            if (debug) info(m)
            return m
          }
        const cwd = filesystem.cwd()
        const projectPath = path(cwd,projectName)
        filesystem.dir(projectPath)
        reportProgress(.1)
        // cd into project
        process.chdir(projectName)
        // Initialize yarn and git
        await spawnProgress("yarn init --yes && git init", {
            env: { ...process.env },
        })
        reportProgress(.1)
        await packager.add("@cloudpresser/press-template")
        reportProgress(.2)
        
        // Replace package.json strings
        let packageJsonRaw = filesystem.read( path(projectPath, "package.json"))
        
        packageJsonRaw = packageJsonRaw
            .replace(/\@cloudpresser\/press-template/g, projectNameKebab)
            .replace(/private: true/g, "private: false")
        const packageJson = JSON.parse(packageJsonRaw)
        const nodePath = path(projectPath,'node_modules/@cloudpresser/press-template')
        filesystem.copy(nodePath, projectPath)
        filesystem.write("package.json", packageJson)

        // Install Deps
        reportProgress(.3)
        await packager.install({ onProgress: (log) })
        reportProgress(.3)
        // // Make sure all our modifications are formatted nicely
        // await spawnProgress("yarn format", {})
    },
    getStarted: ({projectName})=>[`  cd ${projectName}`, `  yarn start`],
    pluginName: "press-template",
    scope: "all"
}