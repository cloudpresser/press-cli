"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAndroidInstalled = void 0;
var isAndroidInstalled = function (toolbox) {
    var androidHome = process.env.ANDROID_HOME;
    var hasAndroidEnv = !toolbox.strings.isBlank(androidHome);
    var hasAndroid = hasAndroidEnv && toolbox.filesystem.exists(androidHome + "/tools") === "dir";
    return Boolean(hasAndroid);
};
exports.isAndroidInstalled = isAndroidInstalled;
//# sourceMappingURL=react-native.js.map