"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installGenerators = exports.availableGenerators = exports.generateFromTemplate = exports.installedGenerators = exports.appDir = exports.isPressProject = exports.updateGenerators = exports.showGeneratorHelp = void 0;
var gluegun_1 = require("gluegun");
var ejs = require("ejs");
var pretty_1 = require("./pretty");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showGeneratorHelp(toolbox) {
    var inpress = isPressProject();
    var generators = inpress ? installedGenerators() : [];
    pretty_1.pressHeading();
    pretty_1.heading("press Generators");
    pretty_1.p();
    pretty_1.p("When you create a new app with press CLI, it will install several generator");
    pretty_1.p("templates in the project folder under the `press/templates` folder.");
    pretty_1.p();
    pretty_1.heading("Commands");
    pretty_1.p();
    pretty_1.command("--list  ", "List installed generators", ["press g --list"]);
    pretty_1.command("--update", "Update installed generators. You can also use the 'press update X' format", [
        "press g --update",
        "press g model --update",
        "press update model",
        "press update --all",
    ]);
    pretty_1.warning("          ⚠️  this erases any customizations you've made!");
    pretty_1.p();
    pretty_1.heading("Installed generators");
    pretty_1.p();
    if (inpress) {
        var longestGen_1 = generators.reduce(function (c, g) { return Math.max(c, g.length); }, 0);
        generators.forEach(function (g) {
            pretty_1.command(g.padEnd(longestGen_1), "generates a " + g, ["press g " + g + " Demo"]);
        });
    }
    else {
        pretty_1.warning("⚠️  Not in an press project root. Go to your press project root to see generators.");
    }
}
exports.showGeneratorHelp = showGeneratorHelp;
function updateGenerators(toolbox) {
    var parameters = toolbox.parameters;
    var generatorsToUpdate;
    if (parameters.first) {
        // only update the specified one
        generatorsToUpdate = [parameters.first];
    }
    else {
        // update any available generators
        generatorsToUpdate = availableGenerators();
    }
    var changes = installGenerators(generatorsToUpdate);
    var distinct = function (val, index, self) { return self.indexOf(val) === index; };
    var allGenerators = changes.concat(generatorsToUpdate).filter(distinct).sort();
    pretty_1.heading("Updated " + changes.length + " generator" + (changes.length === 1 ? "" : "s"));
    allGenerators.forEach(function (g) {
        if (changes.includes(g)) {
            pretty_1.heading("  " + g + " - updated");
        }
        else {
            pretty_1.p("  " + g + " - no changes");
        }
    });
}
exports.updateGenerators = updateGenerators;
function isPressProject() {
    return gluegun_1.filesystem.exists("./press") === "dir";
}
exports.isPressProject = isPressProject;
function pressDir() {
    var cwd = process.cwd();
    return gluegun_1.filesystem.path(cwd, "press");
}
function appDir() {
    var cwd = process.cwd();
    return gluegun_1.filesystem.path(cwd, "app");
}
exports.appDir = appDir;
function templatesDir() {
    return gluegun_1.filesystem.path(pressDir(), "templates");
}
/**
 * Finds generator templates installed in the current project
 */
function installedGenerators() {
    var subdirectories = gluegun_1.filesystem.subdirectories, separator = gluegun_1.filesystem.separator;
    var generators = subdirectories(templatesDir()).map(function (g) { return g.split(separator).slice(-1)[0]; });
    return generators;
}
exports.installedGenerators = installedGenerators;
/**
 * Generates something using a template
 */
function generateFromTemplate(generator, options, toolbox) {
    var find = gluegun_1.filesystem.find, path = gluegun_1.filesystem.path, dir = gluegun_1.filesystem.dir, copy = gluegun_1.filesystem.copy, separator = gluegun_1.filesystem.separator;
    var pascalCase = gluegun_1.strings.pascalCase, kebabCase = gluegun_1.strings.kebabCase, pluralize = gluegun_1.strings.pluralize, camelCase = gluegun_1.strings.camelCase;
    var componentProps = options.props.length > 0
        ? options.props.map(function (prop) { return ({ prop: prop.split(":")[0], type: prop.split(":")[1] }); })
        : [];
    // console.log(componentProps)
    // permutations of the name
    var pascalCaseName = pascalCase(options.name);
    var kebabCaseName = kebabCase(options.name);
    var camelCaseName = camelCase(options.name);
    // passed into the template generator
    var props = { camelCaseName: camelCaseName, kebabCaseName: kebabCaseName, pascalCaseName: pascalCaseName, componentProps: componentProps };
    // where are we copying from?
    var templateDir = path(templatesDir(), generator);
    // where are we copying to?
    var destinationDir = generator !== "navigator"
        ? path(appDir(), pluralize(generator), kebabCaseName)
        : path(appDir(), "navigation");
    // find the files
    var files = find(templateDir, { matching: "*" });
    // create destination folder
    dir(destinationDir);
    // loop through the files
    var newFiles = files.map(function (templateFilename) {
        // get the filename and replace `NAME` with the actual name
        var filename = templateFilename.split(separator).slice(-1)[0].replace("NAME", kebabCaseName);
        // strip the .ejs
        if (filename.endsWith(".ejs"))
            filename = filename.slice(0, -4);
        var destinationFile;
        // if .ejs, run through the ejs template system
        if (templateFilename.endsWith(".ejs")) {
            // where we're going
            destinationFile = path(destinationDir, filename);
            // file-specific props
            var data = { props: __assign(__assign({}, props), { filename: filename }) };
            console.log(data);
            // read the template
            var templateContent = gluegun_1.filesystem.read(templateFilename);
            // render the template
            var content = ejs.render(templateContent, data);
            // write to the destination file
            gluegun_1.filesystem.write(destinationFile, content);
        }
        else {
            // no .ejs, so just direct copy
            destinationFile = path(destinationDir, filename);
            copy(templateFilename, destinationFile);
        }
        return destinationFile;
    });
    return newFiles;
}
exports.generateFromTemplate = generateFromTemplate;
/**
 * Directory where we can find press CLI generator templates
 */
function sourceDirectory() {
    return gluegun_1.filesystem.path(__filename, "..", "..", "..", "boilerplate", "press", "templates");
}
/**
 * Finds generator templates in press CLI
 */
function availableGenerators() {
    var subdirectories = gluegun_1.filesystem.subdirectories, separator = gluegun_1.filesystem.separator;
    return subdirectories(sourceDirectory()).map(function (g) { return g.split(separator).slice(-1)[0]; });
}
exports.availableGenerators = availableGenerators;
/**
 * Copies over generators (specific generators, or all) from press CLI to the project
 * press/templates folder.
 */
function installGenerators(generators) {
    var path = gluegun_1.filesystem.path, find = gluegun_1.filesystem.find, copy = gluegun_1.filesystem.copy, dir = gluegun_1.filesystem.dir, cwd = gluegun_1.filesystem.cwd, separator = gluegun_1.filesystem.separator, exists = gluegun_1.filesystem.exists, read = gluegun_1.filesystem.read;
    var sourceDir = sourceDirectory();
    var targetDir = path(cwd(), "press", "templates");
    if (!isPressProject()) {
        throw new Error("Not in an press root directory (can't find ./press folder)");
    }
    // for each generator type, copy it over to the press/templates folder
    var changedGenerators = generators.filter(function (gen) {
        var sourceGenDir = path(sourceDir, gen);
        var targetGenDir = path(targetDir, gen);
        // ensure the directory exists
        dir(targetDir);
        // find all source files
        var files = find(sourceGenDir, { matching: "*" });
        // copy them over
        var changedFiles = files.filter(function (file) {
            var filename = file.split(separator).slice(-1)[0];
            var targetFile = path(targetGenDir, filename);
            if (!exists(targetFile) || read(targetFile) !== read(file)) {
                copy(file, targetFile, { overwrite: true });
                return true;
            }
            else {
                return false;
            }
        });
        return changedFiles.length > 0;
    });
    return changedGenerators;
}
exports.installGenerators = installGenerators;
//# sourceMappingURL=generators.js.map