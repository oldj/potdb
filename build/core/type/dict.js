"use strict";
/**
 * hash
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = tslib_1.__importStar(require("path"));
var clone_1 = require("../../utils/clone");
var io_1 = tslib_1.__importDefault(require("../io"));
var Dict = /** @class */ (function () {
    function Dict(name, dir, options) {
        this._data = null;
        this._path = path.join(dir, name + '.json');
        this.name = name;
        this._io = new io_1.default({
            data_type: 'dict',
            data_path: this._path,
            debug: options.debug,
            dump_delay: options.dump_delay,
        });
    }
    Dict.prototype.ensure = function () {
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
    Dict.prototype.dump = function () {
        if (this._data === null)
            return;
        this._io.dump(tslib_1.__assign({}, this._data))
            .catch(function (e) { return console.error(e); });
    };
    Dict.prototype.get = function (key, default_value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        if (this._data.hasOwnProperty(key)) {
                            return [2 /*return*/, this._data[key]];
                        }
                        return [2 /*return*/, default_value];
                }
            });
        });
    };
    Dict.prototype.set = function (key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data[key] = value;
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    Dict.prototype.update = function (obj) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data = tslib_1.__assign(tslib_1.__assign({}, this._data), obj);
                        this.dump();
                        return [2 /*return*/, this._data];
                }
            });
        });
    };
    Dict.prototype.keys = function () {
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
                    case 2: return [2 /*return*/, Object.keys(this._data)];
                }
            });
        });
    };
    Dict.prototype.all = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensure()];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    Dict.prototype.toJSON = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.all()];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    Dict.prototype.delete = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        if (!this._data.hasOwnProperty(key)) {
                            return [2 /*return*/];
                        }
                        delete this._data[key];
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    Dict.prototype.clear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this._data = {};
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    Dict.prototype.remove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._data = {};
                        return [4 /*yield*/, this._io.remove()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        clone_1.clone
    ], Dict.prototype, "get", null);
    tslib_1.__decorate([
        clone_1.clone
    ], Dict.prototype, "set", null);
    tslib_1.__decorate([
        clone_1.clone
    ], Dict.prototype, "update", null);
    tslib_1.__decorate([
        clone_1.clone
    ], Dict.prototype, "all", null);
    tslib_1.__decorate([
        clone_1.clone
    ], Dict.prototype, "toJSON", null);
    return Dict;
}());
exports.default = Dict;
//# sourceMappingURL=dict.js.map