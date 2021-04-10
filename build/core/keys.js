"use strict";
/**
 * keys
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs2_1 = require("../utils/fs2");
var fs_1 = require("fs");
var path = tslib_1.__importStar(require("path"));
var byFile = function (dir, filenames, ext) {
    if (ext === void 0) { ext = '.json'; }
    return filenames
        .filter(function (fn) {
        if (!fn.endsWith(ext))
            return false;
        var p = path.join(dir, fn);
        return fs2_1.isFile(p);
    })
        .map(function (fn) { return fn.substring(0, fn.length - ext.length); });
};
var byDir = function (dir, filenames) {
    return filenames.filter(function (fn) { return fs2_1.isDir(path.join(dir, fn)); });
};
var getKeys = function (dir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var types, data, _i, types_1, type, keys, target_dir, items;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                types = ['dict', 'list', 'set', 'collection'];
                data = {};
                _i = 0, types_1 = types;
                _a.label = 1;
            case 1:
                if (!(_i < types_1.length)) return [3 /*break*/, 4];
                type = types_1[_i];
                keys = [];
                target_dir = path.join(dir, type);
                if (!fs2_1.isDir(target_dir))
                    return [3 /*break*/, 3];
                return [4 /*yield*/, fs_1.promises.readdir(target_dir)];
            case 2:
                items = _a.sent();
                if (type === 'collection') {
                    keys = byDir(target_dir, items);
                }
                else {
                    keys = byFile(target_dir, items);
                }
                data[type] = keys.sort();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.default = getKeys;
//# sourceMappingURL=keys.js.map