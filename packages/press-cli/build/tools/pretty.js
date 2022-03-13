"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warning = exports.direction = exports.command = exports.pressHeading = exports.link = exports.heading = exports.p = void 0;
var print_1 = require("gluegun/print");
var _a = print_1.print.colors, cyan = _a.cyan, gray = _a.gray, white = _a.white, bold = _a.bold, yellow = _a.yellow;
var underline = print_1.print.colors.underline;
var p = function (m) {
    if (m === void 0) { m = ""; }
    return print_1.print.info("   " + m);
};
exports.p = p;
var heading = function (m) {
    if (m === void 0) { m = ""; }
    return exports.p(white(bold(m)));
};
exports.heading = heading;
var link = function (m) {
    if (m === void 0) { m = ""; }
    return underline(white(m));
};
exports.link = link;
// export const pressHeading = (m = "") => p(red(bold(m)))
var pressHeading = function () {
    return exports.p(cyan("\n     ___         ___           ___           ___           ___      \n    /\\  \\       /\\  \\         /\\__\\         /\\__\\         /\\__\\     \n   /::\\  \\     /::\\  \\       /:/ _/_       /:/ _/_       /:/ _/_    \n  /:/\\:\\__\\   /:/\\:\\__\\     /:/ /\\__\\     /:/ /\\  \\     /:/ /\\  \\   \n /:/ /:/  /  /:/ /:/  /    /:/ /:/ _/_   /:/ /::\\  \\   /:/ /::\\  \\  \n/:/_/:/  /  /:/_/:/__/___ /:/_/:/ /\\__\\ /:/_/:/\\:\\__\\ /:/_/:/\\:\\__\\ \n\\:\\/:/  /   \\:\\/:::::/  / \\:\\/:/ /:/  / \\:\\/:/ /:/  / \\:\\/:/ /:/  / \n \\::/__/     \\::/~~/~~~~   \\::/_/:/  /   \\::/ /:/  /   \\::/ /:/  /  \n  \\:\\  \\      \\:\\~~\\        \\:\\/:/  /     \\/_/:/  /     \\/_/:/  /   \n   \\:\\__\\      \\:\\__\\        \\::/  /        /:/  /        /:/  /    \n    \\/__/       \\/__/         \\/__/         \\/__/         \\/__/     \n    \n    "));
};
exports.pressHeading = pressHeading;
var command = function (m, second, examples) {
    if (m === void 0) { m = ""; }
    if (second === void 0) { second = ""; }
    if (examples === void 0) { examples = []; }
    exports.p(white(m) + "  " + gray(second));
    var indent = m.length + 2;
    if (examples) {
        examples.forEach(function (ex) { return exports.p(gray(" ".repeat(indent) + ex)); });
    }
};
exports.command = command;
var direction = function (m) {
    if (m === void 0) { m = ""; }
    return exports.p(cyan(m));
};
exports.direction = direction;
var warning = function (m) {
    if (m === void 0) { m = ""; }
    return exports.p(yellow(m));
};
exports.warning = warning;
//# sourceMappingURL=pretty.js.map