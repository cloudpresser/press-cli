"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnProgress = void 0;
function spawnProgress(commandLine, options) {
    return new Promise(function (resolve, reject) {
        var args = commandLine.split(" ");
        var spawned = require("cross-spawn")(args.shift(), args, options);
        var output = [];
        spawned.stdout.on("data", function (data) {
            data = data.toString();
            return options.onProgress ? options.onProgress(data) : output.push(data);
        });
        spawned.stderr.on("data", function (data) { return output.push(data); });
        spawned.on("close", function (code) { return (code === 0 ? resolve("") : reject(output.join())); });
        spawned.on("error", function (err) { return reject(err); });
    });
}
exports.spawnProgress = spawnProgress;
//# sourceMappingURL=spawn.js.map