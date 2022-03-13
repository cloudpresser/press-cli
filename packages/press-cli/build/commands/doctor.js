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
var os = require("os");
var isWindows = process.platform === "win32";
var isMac = process.platform === "darwin";
module.exports = {
    description: "Checks your dev environment for dependencies.",
    run: function (toolbox) {
        return __awaiter(this, void 0, void 0, function () {
            var separator, _a, run, which, _b, colors, info, table, padEnd, meta, column1, column2, column3, platform, arch, cpus, firstCpu, cpu, cores, directory, nodePath, nodeVersion, npmPath, npmVersion, _c, yarnPath, yarnVersion, _d, pressPath, pressSrcPath, pressVersion, pressTable, androidPath, javaPath, javaVersionCmd, javaVersion, _e, xcodePath, xcodeVersion, _f, cocoaPodsPath, cocoaPodsVersion, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        separator = toolbox.filesystem.separator, _a = toolbox.system, run = _a.run, which = _a.which, _b = toolbox.print, colors = _b.colors, info = _b.info, table = _b.table, padEnd = toolbox.strings.padEnd, meta = toolbox.meta;
                        column1 = function (label, length) {
                            if (length === void 0) { length = 16; }
                            return padEnd(label || "", length);
                        };
                        column2 = function (label) { return colors.yellow(padEnd(label || "-", 10)); };
                        column3 = function (label) { return colors.muted(label); };
                        platform = process.platform;
                        arch = os.arch();
                        cpus = os.cpus() || [];
                        firstCpu = cpus[0] || { model: undefined };
                        cpu = "" + firstCpu.model;
                        cores = cpus.length + " cores";
                        directory = "" + process.cwd();
                        info(colors.cyan("System"));
                        table([
                            [column1("platform"), column2(platform), column3("")],
                            [column1("arch"), column2(arch), column3("")],
                            [column1("cpu"), column2(cores), column3(cpu)],
                            [column1("directory"), column2(directory.split(separator).pop()), column3(directory)],
                        ]);
                        nodePath = which("node");
                        return [4 /*yield*/, run("node --version", { trim: true })];
                    case 1:
                        nodeVersion = (_h.sent()).replace("v", "");
                        npmPath = which("npm");
                        _c = npmPath;
                        if (!_c) return [3 /*break*/, 3];
                        return [4 /*yield*/, run("npm --version", { trim: true })];
                    case 2:
                        _c = (_h.sent());
                        _h.label = 3;
                    case 3:
                        npmVersion = _c;
                        yarnPath = which("yarn");
                        _d = yarnPath;
                        if (!_d) return [3 /*break*/, 5];
                        return [4 /*yield*/, run("yarn --version", { trim: true })];
                    case 4:
                        _d = (_h.sent());
                        _h.label = 5;
                    case 5:
                        yarnVersion = _d;
                        yarnPath = yarnPath || "not installed";
                        info("");
                        info(colors.cyan("JavaScript"));
                        table([
                            [column1("node"), column2(nodeVersion), column3(nodePath)],
                            [column1("npm"), column2(npmVersion), column3(npmPath)],
                            [column1("yarn"), column2(yarnVersion), column3(yarnPath)],
                        ]);
                        pressPath = which("press");
                        pressSrcPath = "" + meta.src;
                        pressVersion = meta.version();
                        // const pressJson = press.loadpressConfig()
                        // const installedGenerators = runtime.commands
                        //   .filter(cmd => cmd.name === "generate")
                        //   .sort((a, b) => (a.commandPath.join(" ") < b.commandPath.join(" ") ? -1 : 1))
                        //   .reduce((acc, k) => {
                        //     k.plugin.commands.map(c => {
                        //       if (c.plugin.name === k.plugin.name && k.plugin.name !== "press" && c.name !== "generate") {
                        //         if (!acc[c.name]) {
                        //           acc[c.name] = [k.plugin.name]
                        //         } else {
                        //           acc[c.name].push(k.plugin.name)
                        //         }
                        //       }
                        //     })
                        //     return acc
                        //   }, {})
                        // pressJson.generators = Object.assign({}, installedGenerators, pressJson.generators)
                        info("");
                        info(colors.cyan("Press"));
                        pressTable = [];
                        pressTable.push([column1("press-cli"), column2(pressVersion), column3(pressPath)]);
                        pressTable.push([
                            column1("press src"),
                            column2(pressSrcPath.split(separator).pop()),
                            column3(pressSrcPath),
                        ]);
                        // if (pressJson) {
                        //   Object.keys(pressJson).forEach(k => {
                        //     const v = typeof pressJson[k] === "object" ? JSON.stringify(pressJson[k]) : pressJson[k]
                        //     if (k === "generators") {
                        //       pressTable.push([column1(k), column2(" "), column3("")])
                        //       Object.keys(pressJson[k]).forEach(t => {
                        //         const l = Array.isArray(pressJson[k][t]) ? pressJson[k][t].join(", ") : pressJson[k][t]
                        //         pressTable.push([column1(""), column2(t), column3(l)])
                        //       })
                        //     } else {
                        //       pressTable.push([column1(k), column2(v), column3("")])
                        //     }
                        //   })
                        // }
                        table(pressTable);
                        androidPath = process.env.ANDROID_HOME;
                        javaPath = which("java");
                        javaVersionCmd = isWindows ? "java -version" : "java -version 2>&1";
                        _e = javaPath;
                        if (!_e) return [3 /*break*/, 7];
                        return [4 /*yield*/, run(javaVersionCmd)];
                    case 6:
                        _e = (_h.sent()).match(/"(.*)"/).slice(-1)[0];
                        _h.label = 7;
                    case 7:
                        javaVersion = _e;
                        info("");
                        info(colors.cyan("Android"));
                        table([
                            [column1("java"), column2(javaVersion), column3(javaPath)],
                            [column1("android home"), column2("-"), column3(androidPath)],
                        ]);
                        if (!isMac) return [3 /*break*/, 13];
                        xcodePath = which("xcodebuild");
                        _f = xcodePath;
                        if (!_f) return [3 /*break*/, 9];
                        return [4 /*yield*/, run("xcodebuild -version", { trim: true })];
                    case 8:
                        _f = (_h.sent()).split(/\s/)[1];
                        _h.label = 9;
                    case 9:
                        xcodeVersion = _f;
                        info("");
                        info(colors.cyan("iOS"));
                        table([[column1("xcode"), column2(xcodeVersion)]]);
                        cocoaPodsPath = which("pod") || "";
                        if (!cocoaPodsPath) return [3 /*break*/, 11];
                        return [4 /*yield*/, run("pod --version", { trim: true })];
                    case 10:
                        _g = _h.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _g = "Not installed";
                        _h.label = 12;
                    case 12:
                        cocoaPodsVersion = _g;
                        table([[column1("cocoapods"), column2(cocoaPodsVersion), column3(cocoaPodsPath)]]);
                        _h.label = 13;
                    case 13:
                        // -=-=-=- windows -=-=-=-
                        // TODO: what can we check on Windows?
                        if (isWindows) {
                            // info('')
                            // info(colors.cyan('Windows'))
                            // table([])
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
};
//# sourceMappingURL=doctor.js.map