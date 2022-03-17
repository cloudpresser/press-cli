import { GluegunToolbox } from "gluegun"
interface Utils {
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
interface PluginMetadata {
    pluginName: String
    pluginPath: String
    install: (reportProgress: (progress:Number) => void) => Promise<boolean>
    pluginModule: String
    getStarted
}
export class PluginInstallManager {
    plugins: PluginMetadata[]
    utils: Utils
    pluginModules: String[]
    toolbox: GluegunToolbox
    pluginLength: Number= 0
    constructor(pluginModules:String[], toolbox: GluegunToolbox, utils){
        this.plugins = pluginModules.map(module=>getMetadata(toolbox, module, utils))
        this.utils = utils
        this.toolbox = toolbox
        this.pluginModules = pluginModules
        this.pluginLength = pluginModules.length
    }
    progress: Number = 0
    getNames(){
        return this.plugins.map(({pluginName})=>pluginName)
    }
    getPrettyNames(){
        return this.plugins.map(({pluginName})=>pluginName).join(' ,')
    }
    getGetStartedStrings(){
        return [...this.plugins.map(({getStarted})=>getStarted(this.utils))]
    }
    spinner
    reportProgress(value){
        this.progress += value
        const progressPercentage = 'Progress: ' + ((Number(this.progress) / Number(this.pluginLength))*100).toString()
        if(!this.spinner) {
            this.spinner = this.toolbox.print.spin(progressPercentage)
        } 
        this.spinner.text = progressPercentage
        if(this.progress == this.pluginLength){
            this.spinner.succeed(`🧊 Cooling print nozzles`)
        }

    }
    async installAll(){
        this.utils.p(`🖨  3D-printing a new Press Project`)
        return await Promise.all(this.plugins.map(async ({install})=>await install(this.reportProgress.bind(this))))
    }
}
function getMetadata(toolbox: GluegunToolbox, pluginModule, utils: Utils){
    const pluginPath = utils.path(require.resolve(`${pluginModule}/package.json`), "..")
    const pluginConfig = require(`${pluginModule}/press.config.js`) 
    const pluginName = pluginConfig.pluginName
    const getStarted = pluginConfig.getStarted
    const install = async (reportProgress) => {
        return await require(`${pluginModule}/press.config.js`).installPlugin({...utils, boilerplatePath: pluginPath, reportProgress})
          .then(res=> true )
    }

    return {pluginName, pluginPath, install, pluginModule, getStarted}
    
}