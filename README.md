# Press-cli

Press was made to be a tool to help you rapidly develop with typescript, react-native ~~, graphql and serverless functions~~.

It achive this by giving you a quick way to:

- Have a project up with database, api and supporting serverless functions without writing boilerplate or extensive configuration
- Enjoy awesome development support features and skip boilerplate code by generating new aspects of your application such as screens, components, ~~scripts and serverless functions~~ using completely customizable and extensible generator templates
- WIP: Deploy your project's infrastructure in minutes with preconfigured services, and customizable options using or developing your own plugins

<!-- But you can use it your own stack of choice. -->

## Getting started

- ~~Have docker installed~~
  - No docker knowledge needed, it just runs in the background!
  - How to install docker docs here...
- Install press

  - `yarn global add press-cli`

- Create a new project

  - `press new $projectName`

- Go to your new project

  - `cd $projectName`

- Start developing
  - `yarn start`

And you have a new mobile app running with react native, ~~postgres database, graphql api and serverless functions~~ ready to be developped with generators for all of them!

## WIP: File Structure

```
/project_name
|---/package.json
|---/press.json ? => configuration for each plugin
|---/mobile
|---/web
|---/shared
|---|---/utils
|---|---/scripts
|---|---/models
|---/functions
|---/press
|---|---/templates
|---|---|---/mobile
|---|---|---|---/screen
|---|---|---|---/component
|---|---|---/web
|---|---|---/shared
|---|---|---|---/utils
|---|---|---|---/scripts
|---|---|---|---/models
|---/functions
|---/node_modules *ignored
|---/db_data *ignored
|---/files *ignored
```

## Commands

- `press generate $generator_name $instance_name`
  - scans generators for folder of `$generator_name`
    - if found, outputs evaluates template inside `/project_name/press/templates` using `$instance_name` and outputs to relative path inside `/project_name`
  - if `$generator_name === list`, press will output all available generators
- `press new $project_name`
  - Creates a new Press project
- WIP: `press start $plugin_name`
  - runs configured start command for specified plugin inside plugin folder
  - start command must be configured inside press.json
  - if no `$plugin_name`, it will start all plugins
- WIP: `press develop $plugin_name`
  - runs configured develop command for specified plugin inside plugin folder
  - develop command must be configured inside press.json
  - if no `$plugin_name`, it will run the develop for all plugins
- WIP: `press deploy $plugin_name`
  - deploys specified plugin to production
  - if no `$plugin_name`, it will deploy all plugins
- WIP: `press install $plugin_name`
  - installs a press plugin
  - press plugins are hosted on npm and package name must start with press
  - installing a plugin will scaffold the plugin inside your press project
- WIP: `press eject $plugin_name`
  - outputs a plugin's default generators to the root of your press project
  - generators can now be edited as needed

## WIP: Plugins

Plugins are distinct aspects of a press application.
A plugin is a way for developers to bring their own needs into press
