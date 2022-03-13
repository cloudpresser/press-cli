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
var spawn_1 = require("../tools/spawn");
var react_native_1 = require("../tools/react-native");
var packager_1 = require("../tools/packager");
var pretty_1 = require("../tools/pretty");
exports.default = {
    run: function (toolbox) { return __awaiter(void 0, void 0, void 0, function () {
        var print, filesystem, system, meta, parameters, strings, kebabCase, path, info, colors, gray, red, magenta, cyan, yellow, perfStart, validateProjectName, projectName, projectNameKebab, bname, debug, log, expo, cli, pressPath, boilerplatePath, cliEnv, cliString, cwd, gitPath, packageJsonRaw, packageJson, perfDuration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    print = toolbox.print, filesystem = toolbox.filesystem, system = toolbox.system, meta = toolbox.meta, parameters = toolbox.parameters, strings = toolbox.strings;
                    kebabCase = strings.kebabCase;
                    path = filesystem.path;
                    info = print.info, colors = print.colors;
                    gray = colors.gray, red = colors.red, magenta = colors.magenta, cyan = colors.cyan, yellow = colors.yellow;
                    perfStart = new Date().getTime();
                    validateProjectName = require("../tools/validations").validateProjectName;
                    projectName = validateProjectName(toolbox);
                    projectNameKebab = kebabCase(projectName);
                    bname = parameters.options.b || parameters.options.boilerplate;
                    if (bname) {
                        pretty_1.p();
                        pretty_1.p(yellow("Different boilerplates are no longer supported in press v4+."));
                        pretty_1.p(gray("To use the old CLI to support different boilerplates, try:"));
                        pretty_1.p(cyan("npx press-cli@3 new " + projectName + " --boilerplate " + bname));
                        process.exit(1);
                    }
                    debug = Boolean(parameters.options.debug);
                    log = function (m) {
                        if (debug)
                            info(m);
                        return m;
                    };
                    expo = true;
                    cli = expo ? "expo-cli" : "react-native-cli";
                    pressPath = path("" + meta.src, "..");
                    boilerplatePath = path(pressPath, "boilerplate");
                    cliEnv = expo && debug ? __assign(__assign({}, process.env), { EXPO_DEBUG: 1 }) : process.env;
                    cliString = expo
                        ? "npx expo-cli init " + projectName + " --template " + boilerplatePath + " --non-interactive"
                        : "npx react-native init " + projectName + " --template file://" + pressPath + (debug ? " --verbose" : "");
                    log({ expo: expo, cli: cli, pressPath: pressPath, boilerplatePath: boilerplatePath, cliString: cliString });
                    // welcome everybody!
                    pretty_1.p("\n");
                    pretty_1.pressHeading();
                    pretty_1.p(" \u2588 Creating " + magenta(projectName) + " using " + cyan("press") + " " + meta.version());
                    pretty_1.p(" \u2588 Powered by " + cyan("CloudPresser") + " - https://cloudpresser.com");
                    pretty_1.p(" \u2588 Using " + red(cli));
                    pretty_1.p(" \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n");
                    pretty_1.p("\uD83D\uDD25 Pressing app");
                    // generate the project
                    return [4 /*yield*/, spawn_1.spawnProgress(log(cliString), {
                            env: cliEnv,
                            onProgress: function (out) {
                                out = log(out.toString());
                                if (expo) {
                                    if (out.includes("Using Yarn"))
                                        pretty_1.p("\uD83E\uDE94 Summoning Expo CLI");
                                    if (out.includes("project is ready"))
                                        pretty_1.p("\uD83C\uDFAB Cleaning up Expo install");
                                }
                                else {
                                    if (out.includes("Welcome to React Native!"))
                                        pretty_1.p("\uD83D\uDDA8  3D-printing a new React Native app");
                                    if (out.includes("Run instructions for"))
                                        pretty_1.p("\uD83E\uDDCA Cooling print nozzles");
                                }
                            },
                        })
                        // note the original directory
                    ];
                case 1:
                    // generate the project
                    _a.sent();
                    cwd = log(process.cwd());
                    // jump into the project to do additional tasks
                    process.chdir(projectName);
                    gitPath = log(path(process.cwd(), ".gitignore"));
                    if (!filesystem.exists(gitPath)) {
                        filesystem.copy(path(boilerplatePath, ".gitignore"), gitPath);
                    }
                    packageJsonRaw = filesystem.read("package.json");
                    packageJsonRaw = packageJsonRaw
                        .replace(/HelloWorld/g, projectName)
                        .replace(/hello-world/g, projectNameKebab);
                    packageJson = JSON.parse(packageJsonRaw);
                    // packageJson.scripts.prepare = "npm-run-all patch hack:*"
                    // if (expo) {
                    //   const merge = require("deepmerge-json")
                    //   const expoJson = filesystem.read("package.expo.json", "json")
                    //   packageJson = merge(packageJson, expoJson)
                    // }
                    filesystem.write("package.json", packageJson);
                    if (!expo) return [3 /*break*/, 3];
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
                    pretty_1.p("\uD83E\uDDF6 Unboxing NPM dependencies");
                    return [4 /*yield*/, packager_1.packager.install({ onProgress: log })
                        // for some reason we need to do this, or we get an error about duplicate RNCSafeAreaProviders
                        // see https://github.com/th3rdwave/react-native-safe-area-context/issues/110#issuecomment-668864576
                        // await packager.add("react-native-safe-area-context", { expo: true })
                    ];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    // remove the Expo-specific files -- not needed
                    filesystem.remove("./bin/downloadExpoApp.sh");
                    filesystem.remove("./e2e/reload.expo.js");
                    filesystem.remove("./app/utils/storage/async-storage.expo.ts");
                    // install pods
                    pretty_1.p("\u2615\uFE0F Baking CocoaPods");
                    return [4 /*yield*/, spawn_1.spawnProgress("npx pod-install", {})];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!(parameters.options.git !== false)) return [3 /*break*/, 7];
                    pretty_1.p("\uD83D\uDDC4  Backing everything up in source control");
                    return [4 /*yield*/, system.run(log("\n          \\rm -rf ./.git\n          git init;\n          git add -A;\n          git commit -m \"New press " + meta.version() + " app\";\n        "))];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    // back to the original directory
                    process.chdir(log(cwd));
                    perfDuration = Math.round((new Date().getTime() - perfStart) / 10) / 100;
                    pretty_1.p();
                    pretty_1.p();
                    pretty_1.heading(red("press CLI") + " pressd " + yellow(projectName) + " in " + gray(perfDuration + "s"));
                    pretty_1.p();
                    pretty_1.direction("To get started:");
                    pretty_1.command("  cd " + projectName);
                    if (expo) {
                        pretty_1.command("  yarn start");
                    }
                    else {
                        if (process.platform === "darwin") {
                            pretty_1.command("  npx react-native run-ios");
                        }
                        pretty_1.command("  npx react-native run-android");
                        if (react_native_1.isAndroidInstalled(toolbox)) {
                            pretty_1.p();
                            pretty_1.direction("To run in Android, make sure you've followed the latest react-native setup");
                            pretty_1.direction("instructions at https://facebook.github.io/react-native/docs/getting-started.html");
                            pretty_1.direction("before using press. You won't be able to run Android successfully until you have.");
                        }
                    }
                    // p()
                    // p("Need additional help?")
                    // p()
                    // direction("Join our Slack community at http://community.infinite.red.")
                    pretty_1.p();
                    pretty_1.heading("Now get cooking! 🍽");
                    pretty_1.pressHeading();
                    return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=new.js.map