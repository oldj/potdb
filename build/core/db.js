"use strict";
/**
 * db
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var keys_1 = tslib_1.__importDefault(require("./keys"));
var path = tslib_1.__importStar(require("path"));
var settings_1 = tslib_1.__importDefault(require("../settings"));
var collection_1 = tslib_1.__importDefault(require("./type/collection"));
var dict_1 = tslib_1.__importDefault(require("./type/dict"));
var list_1 = tslib_1.__importDefault(require("./type/list"));
var set_1 = tslib_1.__importDefault(require("./type/set"));
var PotDb = /** @class */ (function () {
    function PotDb(root_dir, options) {
        // if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
        //   throw new Error(`'${path}' is not a directory.`)
        // }
        var _this = this;
        this._dict = {};
        this._list = {};
        this._set = {};
        this._collection = {};
        this.dir = root_dir;
        this.options = tslib_1.__assign(tslib_1.__assign({}, this.getDefaultOptions()), options);
        this.dict = new Proxy({}, {
            get: function (target, key, receiver) {
                var name = key.toString();
                if (!_this._dict.hasOwnProperty(name)) {
                    _this._dict[name] = new dict_1.default(name, path.join(_this.dir, 'dict'), _this.options);
                }
                return _this._dict[name];
            },
        });
        this.list = new Proxy({}, {
            get: function (target, key, receiver) {
                var name = key.toString();
                if (!_this._list.hasOwnProperty(name)) {
                    _this._list[name] = new list_1.default(name, path.join(_this.dir, 'list'), _this.options);
                }
                return _this._list[name];
            },
        });
        this.set = new Proxy({}, {
            get: function (target, key, receiver) {
                var name = key.toString();
                if (!_this._set.hasOwnProperty(name)) {
                    _this._set[name] = new set_1.default(name, path.join(_this.dir, 'set'), _this.options);
                }
                return _this._set[name];
            },
        });
        this.collection = new Proxy({}, {
            get: function (target, key, receiver) {
                var name = key.toString();
                if (!_this._collection.hasOwnProperty(name)) {
                    _this._collection[name] = new collection_1.default(_this, name);
                }
                return _this._collection[name];
            },
        });
    }
    PotDb.prototype.getDefaultOptions = function () {
        var options = {
            debug: false,
            dump_delay: settings_1.default.io_dump_delay,
            ignore_error: true,
        };
        return options;
    };
    PotDb.prototype.keys = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, keys_1.default(this.dir)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PotDb.prototype.toJSON = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys, data, _i, _a, name_1, _b, _c, _d, _e, name_2, _f, _g, _h, _j, name_3, _k, _l, _m, _o, name_4, _p, _q;
            var _r;
            return tslib_1.__generator(this, function (_s) {
                switch (_s.label) {
                    case 0: return [4 /*yield*/, this.keys()];
                    case 1:
                        keys = _s.sent();
                        data = {};
                        // dict
                        data.dict = {};
                        if (!keys.dict) return [3 /*break*/, 5];
                        _i = 0, _a = keys.dict;
                        _s.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        name_1 = _a[_i];
                        _b = data.dict;
                        _c = name_1;
                        return [4 /*yield*/, this.dict[name_1].all()];
                    case 3:
                        _b[_c] = _s.sent();
                        _s.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // list
                        data.list = {};
                        if (!keys.list) return [3 /*break*/, 9];
                        _d = 0, _e = keys.list;
                        _s.label = 6;
                    case 6:
                        if (!(_d < _e.length)) return [3 /*break*/, 9];
                        name_2 = _e[_d];
                        _f = data.list;
                        _g = name_2;
                        return [4 /*yield*/, this.list[name_2].all()];
                    case 7:
                        _f[_g] = _s.sent();
                        _s.label = 8;
                    case 8:
                        _d++;
                        return [3 /*break*/, 6];
                    case 9:
                        // set
                        data.set = {};
                        if (!keys.set) return [3 /*break*/, 13];
                        _h = 0, _j = keys.set;
                        _s.label = 10;
                    case 10:
                        if (!(_h < _j.length)) return [3 /*break*/, 13];
                        name_3 = _j[_h];
                        _k = data.set;
                        _l = name_3;
                        return [4 /*yield*/, this.set[name_3].all()];
                    case 11:
                        _k[_l] = _s.sent();
                        _s.label = 12;
                    case 12:
                        _h++;
                        return [3 /*break*/, 10];
                    case 13:
                        // collection
                        data.collection = {};
                        if (!keys.collection) return [3 /*break*/, 18];
                        _m = 0, _o = keys.collection;
                        _s.label = 14;
                    case 14:
                        if (!(_m < _o.length)) return [3 /*break*/, 18];
                        name_4 = _o[_m];
                        _p = data.collection;
                        _q = name_4;
                        _r = {};
                        return [4 /*yield*/, this.collection[name_4]._getMeta()];
                    case 15:
                        _r.meta = _s.sent();
                        return [4 /*yield*/, this.collection[name_4].all()];
                    case 16:
                        _p[_q] = (_r.data = _s.sent(),
                            _r);
                        _s.label = 17;
                    case 17:
                        _m++;
                        return [3 /*break*/, 14];
                    case 18: return [2 /*return*/, data];
                }
            });
        });
    };
    PotDb.prototype.loadJSON = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _i, _a, name_5, _b, _c, name_6, _d, _e, name_7, _f, _g, name_8, _h, _j, doc;
            return tslib_1.__generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!data.dict) return [3 /*break*/, 4];
                        _i = 0, _a = Object.keys(data.dict);
                        _k.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name_5 = _a[_i];
                        return [4 /*yield*/, this.dict[name_5].update(data.dict[name_5])];
                    case 2:
                        _k.sent();
                        _k.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!data.list) return [3 /*break*/, 8];
                        _b = 0, _c = Object.keys(data.list);
                        _k.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 8];
                        name_6 = _c[_b];
                        return [4 /*yield*/, this.list[name_6].update(data.list[name_6])];
                    case 6:
                        _k.sent();
                        _k.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8:
                        if (!data.set) return [3 /*break*/, 12];
                        _d = 0, _e = Object.keys(data.set);
                        _k.label = 9;
                    case 9:
                        if (!(_d < _e.length)) return [3 /*break*/, 12];
                        name_7 = _e[_d];
                        return [4 /*yield*/, this.set[name_7].update(data.set[name_7])];
                    case 10:
                        _k.sent();
                        _k.label = 11;
                    case 11:
                        _d++;
                        return [3 /*break*/, 9];
                    case 12:
                        if (!data.collection) return [3 /*break*/, 21];
                        _f = 0, _g = Object.keys(data.collection);
                        _k.label = 13;
                    case 13:
                        if (!(_f < _g.length)) return [3 /*break*/, 21];
                        name_8 = _g[_f];
                        return [4 /*yield*/, this.collection[name_8].remove()];
                    case 14:
                        _k.sent();
                        _h = 0, _j = data.collection[name_8].data;
                        _k.label = 15;
                    case 15:
                        if (!(_h < _j.length)) return [3 /*break*/, 18];
                        doc = _j[_h];
                        return [4 /*yield*/, this.collection[name_8]._insert(doc)];
                    case 16:
                        _k.sent();
                        _k.label = 17;
                    case 17:
                        _h++;
                        return [3 /*break*/, 15];
                    case 18:
                        if (!data.collection[name_8].meta) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.collection[name_8]._setMeta(data.collection[name_8].meta)];
                    case 19:
                        _k.sent();
                        _k.label = 20;
                    case 20:
                        _f++;
                        return [3 /*break*/, 13];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    return PotDb;
}());
exports.default = PotDb;
//# sourceMappingURL=db.js.map