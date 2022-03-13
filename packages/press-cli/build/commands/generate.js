"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandParser = void 0;
var pretty_1 = require("../tools/pretty");
var generators_1 = require("../tools/generators");
var importers_1 = require("../tools/importers");
module.exports = {
    alias: ["g", "generator", "generators"],
    description: "Generates components and other features from templates",
    run: function (toolbox) { return __awaiter(void 0, void 0, void 0, function () {
        var parameters;
        return __generator(this, function (_a) {
            parameters = toolbox.parameters;
            pretty_1.p();
            if (parameters.options.help || parameters.options.list) {
                // show help or list generators
                generators_1.showGeneratorHelp(toolbox);
            }
            else if (parameters.options.update) {
                // update with fresh generators
                generators_1.updateGenerators(toolbox);
            }
            else if (parameters.first) {
                // actually generate something
                generate(toolbox);
            }
            else {
                // catch-all, just show help
                generators_1.showGeneratorHelp(toolbox);
            }
            return [2 /*return*/];
        });
    }); },
};
function commandParser(toolbox) {
    var _a, _b;
    var parameters = toolbox.parameters, strings = toolbox.strings;
    var generator = parameters.first.toLowerCase();
    var name = parameters.second;
    var pascalName = strings.pascalCase(name);
    // avoid the my-component-component phenomenon
    var pascalGenerator = strings.pascalCase(generator);
    if (pascalName.endsWith(pascalGenerator)) {
        pretty_1.p("Stripping " + pascalGenerator + " from end of name");
        pretty_1.p("Note that you don't need to add " + pascalGenerator + " to the end of the name -- we'll do it for you!");
        pascalName = pascalName.slice(0, -1 * pascalGenerator.length);
        pretty_1.command("press generate " + generator + " " + pascalName);
    }
    // Parse options
    var navigators = (_b = (_a = Object.keys(parameters.options)
        .filter(function (op) { return (op.split(":")[0] = "navigators"); })[0]) === null || _a === void 0 ? void 0 : _a.split(":")[1]) === null || _b === void 0 ? void 0 : _b.split(",");
    var props = Object.keys(parameters.options).filter(function (op) { return op.split(":")[0] !== "navigators"; });
    return {
        name: name,
        pascalName: pascalName,
        generator: generator,
        props: props,
        navigators: navigators,
    };
}
exports.commandParser = commandParser;
function generate(toolbox) {
    var generators = generators_1.installedGenerators();
    // Parse command
    var _a = commandParser(toolbox), name = _a.name, pascalName = _a.pascalName, generator = _a.generator, props = _a.props;
    if (!generators.includes(generator)) {
        pretty_1.warning("\u26A0\uFE0F  Generator \"" + generator + "\" isn't installed.");
        pretty_1.p();
        if (generators_1.availableGenerators().includes(generator)) {
            pretty_1.direction("Install the generator with:");
            pretty_1.p();
            pretty_1.command("press generate " + generator + " --update");
            pretty_1.p();
            pretty_1.direction("... and then try again!");
        }
        else {
            pretty_1.direction("Check your spelling and try again");
        }
        return;
    }
    // we need a name for this component
    if (!name) {
        return pretty_1.warning("\u26A0\uFE0F  Please specify a name for your " + generator + ": press g " + generator + " MyName");
    }
    // okay, let's do it!
    pretty_1.p();
    var newFiles = generators_1.generateFromTemplate(generator, { name: pascalName, props: props }, toolbox);
    pretty_1.heading("Generated new files:");
    newFiles.forEach(function (f) { return pretty_1.p(f); });
    var modifiedFiles = importers_1.executeImports(toolbox);
    if (modifiedFiles.length > 0) {
        pretty_1.heading("Updated files:");
        modifiedFiles.forEach(function (f) { return pretty_1.p(f); });
    }
}
//# sourceMappingURL=generate.js.map