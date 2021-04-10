"use strict";
/**
 * io
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = tslib_1.__importStar(require("fs"));
var path = tslib_1.__importStar(require("path"));
var fs2_1 = require("../utils/fs2");
var wait_1 = tslib_1.__importDefault(require("../utils/wait"));
var IO = /** @class */ (function () {
    function IO(options) {
        this._last_dump_ts = 0;
        this._is_dir_ensured = false;
        this._dump_status = 0; // 0: 不需要 dump; 1: 等待或正在 dump
        this.options = tslib_1.__assign({}, options);
        this.data_path = options.data_path;
        this.data_type = options.data_type;
        this._dump_delay = options.dump_delay;
    }
    IO.prototype.load_file = function (fn) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var d, content, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.promises.readFile(fn, 'utf-8')];
                    case 1:
                        content = _a.sent();
                        d = JSON.parse(content);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, d];
                }
            });
        });
    };
    IO.prototype.load_dict = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, d;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {};
                        if (!fs.existsSync(this.data_path)) {
                            return [2 /*return*/, data];
                        }
                        return [4 /*yield*/, this.load_file(this.data_path)];
                    case 1:
                        d = _a.sent();
                        if (typeof d === 'object') {
                            data = tslib_1.__assign({}, d);
                        }
                        // console.log(data)
                        return [2 /*return*/, data];
                }
            });
        });
    };
    IO.prototype.load_list = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, d;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        if (!fs.existsSync(this.data_path)) {
                            return [2 /*return*/, data];
                        }
                        return [4 /*yield*/, this.load_file(this.data_path)];
                    case 1:
                        d = _a.sent();
                        if (Array.isArray(d)) {
                            data = tslib_1.__spreadArray([], d);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    IO.prototype.load_set = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, d;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = new Set();
                        if (!fs.existsSync(this.data_path)) {
                            return [2 /*return*/, data];
                        }
                        return [4 /*yield*/, this.load_file(this.data_path)];
                    case 1:
                        d = _a.sent();
                        if (Array.isArray(d)) {
                            d.map(function (v) { return data.add(v); });
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    IO.prototype.load = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, dir_path, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this._is_dir_ensured) return [3 /*break*/, 2];
                        dir_path = path.dirname(this.data_path);
                        return [4 /*yield*/, fs2_1.ensureDir(dir_path)];
                    case 1:
                        _b.sent();
                        this._is_dir_ensured = true;
                        _b.label = 2;
                    case 2:
                        _a = this.data_type;
                        switch (_a) {
                            case 'dict': return [3 /*break*/, 3];
                            case 'list': return [3 /*break*/, 5];
                            case 'set': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, this.load_dict()];
                    case 4:
                        data = _b.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, this.load_list()];
                    case 6:
                        data = _b.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.load_set()];
                    case 8:
                        data = _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, data];
                }
            });
        });
    };
    IO.prototype.dump_file = function (data, fn) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var out, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.data_type === 'set') {
                            data = Array.from(data);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        out = this.options.formative ?
                            JSON.stringify(data, null, 2) :
                            JSON.stringify(data);
                        return [4 /*yield*/, fs2_1.ensureDir(path.dirname(fn))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs.promises.writeFile(fn, out, 'utf-8')];
                    case 3:
                        _a.sent();
                        if (this.options.debug) {
                            console.log("io.dump_file: -> " + fn);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    IO.prototype.dump = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ts;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._dump_status = 1;
                        clearTimeout(this._t_dump);
                        ts = (new Date()).getTime();
                        if (ts - this._last_dump_ts < this._dump_delay) {
                            this._t_dump = setTimeout(function () { return _this.dump(data); }, this._dump_delay);
                            return [2 /*return*/];
                        }
                        this._last_dump_ts = ts;
                        return [4 /*yield*/, this.dump_file(data, this.data_path)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, wait_1.default(50)];
                    case 2:
                        _a.sent();
                        this._dump_status = 0;
                        return [2 /*return*/];
                }
            });
        });
    };
    IO.prototype.getDumpStatus = function () {
        return this._dump_status;
    };
    IO.prototype.remove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fn;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fn = this.data_path;
                        if (!fn || !fs.existsSync(fn))
                            return [2 /*return*/];
                        return [4 /*yield*/, fs.promises.unlink(fn)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return IO;
}());
exports.default = IO;
//# sourceMappingURL=io.js.map