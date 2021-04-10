"use strict";
/**
 * ensureDir
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = exports.isFile = exports.isDir = void 0;
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var mkdirp_1 = tslib_1.__importDefault(require("mkdirp"));
var isDir = function (dir_path) {
    return fs_1.default.existsSync(dir_path) && fs_1.default.lstatSync(dir_path).isDirectory();
};
exports.isDir = isDir;
var isFile = function (dir_path) {
    return fs_1.default.existsSync(dir_path) && fs_1.default.lstatSync(dir_path).isFile();
};
exports.isFile = isFile;
var ensureDir = function (dir_path) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (exports.isDir(dir_path))
                    return [2 /*return*/];
                return [4 /*yield*/, mkdirp_1.default(dir_path)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.ensureDir = ensureDir;
//# sourceMappingURL=fs2.js.map