"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeImports = exports.addStory = exports.addToIndex = exports.addToNavigators = void 0;
var gluegun_1 = require("gluegun");
var generate_1 = require("../commands/generate");
var generators_1 = require("./generators");
var pretty_1 = require("./pretty");
function addToNavigators(pascalCaseName, navigators, toolbox) {
    var path = gluegun_1.filesystem.path;
    var patching = toolbox.patching;
    // import to add
    var importToAdd = "import { " + pascalCaseName + " } from \"../screens\"\n";
    var navigatorFiles = navigators === null || navigators === void 0 ? void 0 : navigators.map(function (nav) {
        var navigatorPath = path(generators_1.appDir(), "navigation", nav + "-navigator.tsx");
        // Actually add the import
        if (!gluegun_1.filesystem.exists(navigatorPath)) {
            var msg = "No '" + navigatorPath + "' file found. Can't import component to navigator." +
                " Import your new component manually.";
            pretty_1.p(msg);
            return null;
        }
        patching.prepend(navigatorPath, importToAdd);
        return navigatorPath;
    }).filter(function (f) { return f !== null; });
    return navigatorFiles || [];
}
exports.addToNavigators = addToNavigators;
function addToIndex(kebabCaseName, indexFile, toolbox, generator) {
    var patching = toolbox.patching;
    // Export to add
    var exportToAdd = "export * from \"./" + kebabCaseName + "/" + kebabCaseName + "-" + generator + "\"\n";
    // Actually add the export
    if (!gluegun_1.filesystem.exists(indexFile)) {
        var msg = "No '" + indexFile + "' file found. Can't export component." +
            " Export your new component manually.";
        pretty_1.p(msg);
        return;
    }
    patching.append(indexFile, exportToAdd);
    return indexFile;
}
exports.addToIndex = addToIndex;
function addStory(kebabCaseName, toolbox, generator) {
    var find = gluegun_1.filesystem.find, path = gluegun_1.filesystem.path;
    var pluralize = gluegun_1.strings.pluralize;
    var patching = toolbox.patching;
    var generatorDir = path(generators_1.appDir(), pluralize(generator));
    var storyIndex = find(generatorDir, {
        matching: "storybook-registry.@(ts|tsx|js|jsx)",
        recursive: false,
    })[0];
    // Actually add the export
    if (!storyIndex || !gluegun_1.filesystem.exists(storyIndex)) {
        var msg = "No '" + (generatorDir + "/storybook-registry.@(ts|tsx|js|jsx)") + "' file found. Can't export component." + " Export your new component manually.";
        pretty_1.p(msg);
        return;
    }
    patching.prepend(storyIndex, "require(\"./" + kebabCaseName + "/" + kebabCaseName + ".story\")\n");
    return storyIndex;
}
exports.addStory = addStory;
var executeImports = function (toolbox) {
    var pascalCase = gluegun_1.strings.pascalCase, kebabCase = gluegun_1.strings.kebabCase, pluralize = gluegun_1.strings.pluralize;
    var path = gluegun_1.filesystem.path;
    // Get options from command
    var _a = generate_1.commandParser(toolbox), name = _a.name, generator = _a.generator, navigators = _a.navigators;
    // permutations of the name
    var pascalCaseName = pascalCase(name);
    var kebabCaseName = kebabCase(name);
    // Where is the index?
    var indexFile = path(generators_1.appDir(), pluralize(generator), "index.ts");
    console.log(indexFile);
    var modifiedFiles = __spreadArrays([
        addToIndex(kebabCaseName, indexFile, toolbox, generator),
        addStory(kebabCaseName, toolbox, generator)
    ], addToNavigators(pascalCaseName, navigators, toolbox));
    return modifiedFiles.filter(function (f) { return f !== null; });
};
exports.executeImports = executeImports;
//# sourceMappingURL=importers.js.map