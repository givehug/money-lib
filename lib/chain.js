"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var money_1 = require("./money");
// Helper wrapper to allow chaining
var moneyChain = function (money) {
    if (money === void 0) { money = (0, money_1.zero)(); }
    // unwrap Money from chain, or init with zero value
    var _m = (0, money_1.isValid)(money) ? money : money.toJSON();
    _m.currency = _m.currency || config_1.config.defaultCurrency;
    return {
        zero: function () { return moneyChain((0, money_1.zero)()); },
        fromInt: function (amount, currency) {
            return moneyChain((0, money_1.fromInt)(amount, currency));
        },
        fromFloat: function (amount, currency) {
            return moneyChain((0, money_1.fromFloat)(amount, currency));
        },
        fromIntString: function (amount, currency) {
            return moneyChain((0, money_1.fromIntString)(amount, currency));
        },
        fromFloatString: function (amount, currency) {
            return moneyChain((0, money_1.fromFloatString)(amount, currency));
        },
        toInt: function () { return (0, money_1.toInt)(_m); },
        toCents: function () { return (0, money_1.toInt)(_m); },
        toFloat: function () { return (0, money_1.toFloat)(_m); },
        toString: function () { return (0, money_1.toString)(_m); },
        toIntString: function () { return (0, money_1.toString)(_m); },
        toCentsString: function () { return (0, money_1.toString)(_m); },
        toFloatString: function () { return (0, money_1.toFloatString)(_m); },
        compare: function (m) { return (0, money_1.compare)(_m, moneyChain(m).toJSON()); },
        equals: function (m) { return (0, money_1.equals)(_m, moneyChain(m).toJSON()); },
        greaterThan: function (m) {
            return (0, money_1.greaterThan)(_m, moneyChain(m).toJSON());
        },
        greaterThanOrEqual: function (m) {
            return (0, money_1.greaterThanOrEqual)(_m, moneyChain(m).toJSON());
        },
        lessThan: function (m) { return (0, money_1.lessThan)(_m, moneyChain(m).toJSON()); },
        lessThanOrEqual: function (m) {
            return (0, money_1.lessThanOrEqual)(_m, moneyChain(m).toJSON());
        },
        isZero: function () { return (0, money_1.isZero)(_m); },
        isPositive: function () { return (0, money_1.isPositive)(_m); },
        isNegative: function () { return (0, money_1.isNegative)(_m); },
        min: function (m1) {
            var m = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                m[_i - 1] = arguments[_i];
            }
            return moneyChain(money_1.min.apply(void 0, __spreadArray([moneyChain(m1).toJSON()], m.map(function (m) { return moneyChain(m).toJSON(); }), false)));
        },
        max: function (m1) {
            var m = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                m[_i - 1] = arguments[_i];
            }
            return moneyChain(money_1.max.apply(void 0, __spreadArray([moneyChain(m1).toJSON()], m.map(function (m) { return moneyChain(m).toJSON(); }), false)));
        },
        isValid: function () { return (0, money_1.isValid)(_m); },
        split: function () { return (0, money_1.split)(_m); },
        add: function (m) {
            return moneyChain((0, money_1.add)(_m, moneyChain(m).toJSON()));
        },
        subtract: function (m) {
            return moneyChain((0, money_1.subtract)(_m, moneyChain(m).toJSON()));
        },
        multiply: function (multiplier, round) {
            if (round === void 0) { round = Math.round; }
            return moneyChain((0, money_1.multiply)(_m, multiplier, round));
        },
        divide: function (divider, round) {
            if (round === void 0) { round = Math.round; }
            return moneyChain((0, money_1.divide)(_m, divider, round));
        },
        abs: function () { return moneyChain((0, money_1.abs)(_m)); },
        format: function (ops) { return (0, money_1.format)(_m, ops); },
        formatParts: function (locale) { return (0, money_1.formatParts)(_m, locale); },
        parse: function (s, currency, locale, decimalSeparator) { return moneyChain((0, money_1.parse)(s, currency, locale, decimalSeparator)); },
        debug: function (prefix) {
            if (prefix === void 0) { prefix = "money:"; }
            console.log(prefix, _m);
            return moneyChain(_m);
        },
        toJSON: function () { return _m; },
    };
};
moneyChain.config = config_1.setConfig;
exports.default = moneyChain;
