"use strict";
/**
 * set
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = tslib_1.__importStar(require("path"));
var clone_1 = require("../../utils/clone");
var io_1 = tslib_1.__importDefault(require("../io"));
var LatSet = /** @class */ (function () {
    function LatSet(name, root_dir, options) {
        this._data = null;
        this._path = path.join(root_dir, name + '.json');
        this.name = name;
        this._io = new io_1.default({
            data_type: 'set',
            data_path: this._path,
            debug: options.debug,
            dump_delay: options.dump_delay,
        });
    }
    LatSet.prototype.ensure = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._data === null)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this._io.load()];
                    case 1:
                        _a._data = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this._data];
                }
            });
        });
    };
    LatSet.prototype.dump = function () {
        if (this._data === null)
            return;
        this._io.dump(Array.from(this._data))
            .catch(function (e) { return console.error(e); });
    };
    LatSet.prototype.add = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data.add(value);
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    LatSet.prototype.delete = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data.delete(value);
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    LatSet.prototype.has = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        return [2 /*return*/, this._data.has(value)];
                }
            });
        });
    };
    LatSet.prototype.all = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        return [2 /*return*/, Array.from(this._data)];
                }
            });
        });
    };
    LatSet.prototype.clear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this._data = new Set();
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    LatSet.prototype.set = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var s;
            return tslib_1.__generator(this, function (_a) {
                s = new Set();
                data.map(function (i) { return s.add(i); });
                this._data = s;
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    LatSet.prototype.remove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._data = new Set();
                        return [4 /*yield*/, this._io.remove()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LatSet.prototype.update = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this._data = new Set(data);
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    tslib_1.__decorate([
        clone_1.clone
    ], LatSet.prototype, "set", null);
    return LatSet;
}());
exports.default = LatSet;
//# sourceMappingURL=set.js.map