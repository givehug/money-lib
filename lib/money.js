"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.parse = exports.formatParts = exports.formatIntegerPart = exports.format = exports.split = exports.isValid = exports.max = exports.min = exports.isNegative = exports.isPositive = exports.isZero = exports.lessThanOrEqual = exports.lessThan = exports.greaterThanOrEqual = exports.greaterThan = exports.equals = exports.compare = exports.abs = exports.divide = exports.multiply = exports.subtract = exports.add = exports.toFloatString = exports.toString = exports.toFloat = exports.toInt = exports.fromFloatString = exports.fromIntString = exports.fromFloat = exports.fromInt = exports.zero = void 0;
var config_1 = require("./config");
// ------ Initialization ------ //
var zero = function (currency) {
    if (currency === void 0) { currency = config_1.config.defaultCurrency; }
    return { amount: 0, currency: currency };
};
exports.zero = zero;
var fromInt = function (amount, currency) {
    if (currency === void 0) { currency = config_1.config.defaultCurrency; }
    return { amount: amount, currency: currency };
};
exports.fromInt = fromInt;
var fromFloat = function (amount, currency, round) {
    if (currency === void 0) { currency = config_1.config.defaultCurrency; }
    if (round === void 0) { round = (0, config_1.getDefaultRounder)(); }
    var scale = getCurrencyScale((0, exports.zero)(currency));
    return {
        amount: round(amount * scale, 0),
        currency: currency,
    };
};
exports.fromFloat = fromFloat;
var fromIntString = function (amount, currency) {
    if (currency === void 0) { currency = config_1.config.defaultCurrency; }
    var parsed = parseInt(amount, 10);
    return (0, exports.fromInt)(Number.isNaN(parsed) || parsed === 0 ? 0 : parsed, currency);
};
exports.fromIntString = fromIntString;
var fromFloatString = function (amount, currency, round) {
    if (currency === void 0) { currency = config_1.config.defaultCurrency; }
    if (round === void 0) { round = (0, config_1.getDefaultRounder)(); }
    var parsed = parseFloat(amount);
    return (0, exports.fromFloat)(Number.isNaN(parsed) || parsed === 0 ? 0 : parsed, currency, round);
};
exports.fromFloatString = fromFloatString;
// ------ Serialization ------ //
var toInt = function (m) {
    return m.amount;
};
exports.toInt = toInt;
var toFloat = function (m) {
    var scale = getCurrencyScale(m);
    var _a = (0, exports.split)(m), whole = _a.whole, cents = _a.cents;
    return whole + cents / scale;
};
exports.toFloat = toFloat;
var toString = function (m) {
    return "".concat(m.amount);
};
exports.toString = toString;
var toFloatString = function (m) {
    var scale = getCurrencyScale(m);
    var _a = (0, exports.split)(m), whole = _a.whole, cents = _a.cents;
    return "".concat(whole, ".").concat(cents.toString().padStart(Math.log10(scale), "0"));
};
exports.toFloatString = toFloatString;
// ------ Arithmetics ------ //
var add = function (a, b) {
    return (0, exports.fromInt)(a.amount + b.amount, a.currency);
};
exports.add = add;
var subtract = function (a, b) {
    return (0, exports.fromInt)(a.amount - b.amount, a.currency);
};
exports.subtract = subtract;
var multiply = function (m, multiplier, // | Money
round) {
    if (round === void 0) { round = (0, config_1.getDefaultRounder)(); }
    return (0, exports.fromInt)(round(m.amount * multiplier, 0), m.currency);
};
exports.multiply = multiply;
var divide = function (m, divider, // | Money
round) {
    if (round === void 0) { round = (0, config_1.getDefaultRounder)(); }
    return (0, exports.fromInt)(round(m.amount / divider, 0), m.currency);
};
exports.divide = divide;
var abs = function (m) {
    return __assign(__assign({}, m), { amount: Math.abs(m.amount) });
};
exports.abs = abs;
// ------ Comparison ------ //
var compare = function (a, b) {
    if (a.amount === b.amount) {
        return 0;
    }
    return a.amount > b.amount ? 1 : -1;
};
exports.compare = compare;
var equals = function (a, b) {
    return (0, exports.compare)(a, b) === 0;
};
exports.equals = equals;
var greaterThan = function (a, b) {
    return (0, exports.compare)(a, b) === 1;
};
exports.greaterThan = greaterThan;
var greaterThanOrEqual = function (a, b) {
    return (0, exports.compare)(a, b) >= 0;
};
exports.greaterThanOrEqual = greaterThanOrEqual;
var lessThan = function (a, b) {
    return (0, exports.compare)(a, b) === -1;
};
exports.lessThan = lessThan;
var lessThanOrEqual = function (a, b) {
    return (0, exports.compare)(a, b) <= 0;
};
exports.lessThanOrEqual = lessThanOrEqual;
var isZero = function (m) {
    return m.amount === 0;
};
exports.isZero = isZero;
var isPositive = function (m) {
    return m.amount > 0;
};
exports.isPositive = isPositive;
var isNegative = function (m) {
    return m.amount < 0;
};
exports.isNegative = isNegative;
var min = function (m1) {
    var m = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        m[_i - 1] = arguments[_i];
    }
    return __spreadArray([m1], m, true).reduce(function (acc, curr) { return ((0, exports.lessThan)(acc, curr) ? acc : curr); });
};
exports.min = min;
var max = function (m1) {
    var m = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        m[_i - 1] = arguments[_i];
    }
    return __spreadArray([m1], m, true).reduce(function (acc, curr) {
        return (0, exports.greaterThan)(acc, curr) ? acc : curr;
    });
};
exports.max = max;
// ------ Validation ------ //
var isValid = function (m) {
    return Boolean(typeof m === "object" &&
        (m.amount || m.amount === 0) &&
        (typeof m.currency === "undefined" ||
            (typeof m.currency === "string" &&
                m.currency.length > 0 &&
                !!(0, config_1.getCurrency)(m.currency))));
};
exports.isValid = isValid;
// ------ Transformation ------ //
var split = function (m) {
    var scale = getCurrencyScale(m);
    var whole = Math.trunc(m.amount / scale);
    var cents = m.amount - whole * scale;
    return { whole: whole, cents: cents };
};
exports.split = split;
// ------ Formatting ------ //
var format = function (m, ops) {
    var _a, _b, _c, _d;
    var _e = {
        cents: (_a = ops === null || ops === void 0 ? void 0 : ops.cents) !== null && _a !== void 0 ? _a : true,
        locale: (_b = ops === null || ops === void 0 ? void 0 : ops.locale) !== null && _b !== void 0 ? _b : config_1.config.defaultLocale,
        trailingZeros: (_c = ops === null || ops === void 0 ? void 0 : ops.trailingZeros) !== null && _c !== void 0 ? _c : true,
        withPlusSign: (_d = ops === null || ops === void 0 ? void 0 : ops.withPlusSign) !== null && _d !== void 0 ? _d : false,
    }, cents = _e.cents, locale = _e.locale, trailingZeros = _e.trailingZeros, withPlusSign = _e.withPlusSign;
    var parts = (0, exports.formatParts)(m, locale);
    var signSymbol = parts.sign === "-" ? "-" : "";
    var formatted = "";
    if (!cents && parts.cents === "0".repeat((0, config_1.getCurrency)(m.currency).precision)) {
        formatted = "".concat(signSymbol).concat(parts.currencySymbol).concat(parts.wholeFormatted);
    }
    else {
        formatted = "".concat(signSymbol).concat(parts.currencySymbol).concat(parts.wholeFormatted).concat(parts.decimalSeparator).concat(parts.cents);
    }
    if (!trailingZeros) {
        formatted = formatted.replace(/0+$/, "");
    }
    if (withPlusSign && parts.sign === "+") {
        formatted = "+".concat(formatted);
    }
    return formatted;
};
exports.format = format;
var formatIntegerPart = function (integerPart, locale) {
    if (locale === void 0) { locale = config_1.config.defaultLocale; }
    return new Intl.NumberFormat(locale).format(integerPart);
};
exports.formatIntegerPart = formatIntegerPart;
var formatParts = function (m, locale) {
    if (locale === void 0) { locale = config_1.config.defaultLocale; }
    var _a = (0, config_1.getCurrency)(m.currency), symbol = _a.symbol, precision = _a.precision;
    var decimalSeparator = (0, config_1.getLocale)(locale).decimalSeparator;
    var _b = (0, exports.split)(m), whole = _b.whole, cents = _b.cents;
    var absWhole = Math.abs(whole);
    var wholeFormatted = (0, exports.formatIntegerPart)(absWhole, locale);
    var sign = getAmountSign(m);
    return {
        whole: "".concat(absWhole),
        wholeFormatted: wholeFormatted,
        cents: "".concat(Math.abs(cents)).padStart(precision, "0"),
        currencySymbol: symbol,
        decimalSeparator: decimalSeparator,
        sign: sign,
    };
};
exports.formatParts = formatParts;
// ------ Parsing ------ //
var parse = function (s, currency, locale, decimalSeparator) {
    if (locale === void 0) { locale = config_1.config.defaultLocale; }
    var _decimalSeparator = decimalSeparator !== null && decimalSeparator !== void 0 ? decimalSeparator : (0, config_1.getLocale)(locale).decimalSeparator;
    var amountFloatString = {
        ",": function () {
            return s
                .replace(/[^0-9.,]/g, "")
                .replace(/\./g, "")
                .replace(/\,/g, ".");
        },
        ".": function () { return s.replace(/[^0-9.,]/g, "").replace(/\,/g, ""); },
    }[_decimalSeparator]();
    var parsedFloat = parseFloat(amountFloatString);
    var amountFloat = Number.isNaN(parsedFloat) ? 0 : parsedFloat;
    return (0, exports.fromFloat)(amountFloat, currency);
};
exports.parse = parse;
// ------ Helper methods ------ //
var getCurrencyScale = function (m) {
    return Math.pow(10, (0, config_1.getCurrency)(m.currency).precision);
};
var getAmountSign = function (m) {
    if (m.amount > 0) {
        return "+";
    }
    if (m.amount < 0) {
        return "-";
    }
    return "";
};
