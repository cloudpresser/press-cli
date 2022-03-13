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
var generators_1 = require("../tools/generators");
var pretty_1 = require("../tools/pretty");
module.exports = {
    dashed: true,
    alias: ["h"],
    description: "Displays Press CLI help",
    run: function (toolbox) { return __awaiter(void 0, void 0, void 0, function () {
        var meta, parameters;
        return __generator(this, function (_a) {
            meta = toolbox.meta, parameters = toolbox.parameters;
            pretty_1.p();
            // specific help -- generators
            if (parameters.second &&
                (parameters.second === "g" || parameters.second.startsWith("generat"))) {
                return [2 /*return*/, generators_1.showGeneratorHelp(toolbox)];
            }
            pretty_1.pressHeading();
            pretty_1.heading("Welcome to Press " + meta.version() + "!");
            pretty_1.p();
            pretty_1.p("Press is a CLI that helps you spin up a new React Native app using a");
            pretty_1.p("battle-tested tech stack.");
            pretty_1.p();
            pretty_1.heading("Commands");
            pretty_1.p();
            pretty_1.command("new         ", "Creates a new React Native app", [
                "press new MyApp",
                "press new MyApp --expo",
            ]);
            pretty_1.p();
            pretty_1.command("generate (g)", "Generates components and other app features", [
                "press generate --hello",
                "press generate component Hello",
                "press generate model User",
                "press generate screen Login",
            ]);
            pretty_1.p();
            pretty_1.command("doctor      ", "Checks your environment & displays versions of installed dependencies", ["press doctor"]);
            pretty_1.p();
            pretty_1.direction("See the documentation: " + pretty_1.link("https://github.com/infinitered/press/tree/master/docs"));
            pretty_1.p();
            pretty_1.direction("If you need additional help, join our Slack at " + pretty_1.link("http://community.infinite.red"));
            pretty_1.p();
            pretty_1.pressHeading();
            return [2 /*return*/];
        });
    }); },
};
//# sourceMappingURL=help.js.map