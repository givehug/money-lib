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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.getDefaultRounder = exports.getCurrency = exports.getLocale = exports.config = void 0;
var helpers_1 = require("./helpers");
exports.config = {
    defaultCurrency: "EUR",
    defaultLocale: "NL",
    defaultRoundingMethod: "bankers",
    currencies: {
        EUR: {
            code: "EUR",
            symbol: "€",
            precision: 2,
        },
        USD: {
            code: "USD",
            symbol: "$",
            precision: 2,
        },
        BTC: {
            code: "BTC",
            symbol: "₿",
            precision: 8,
        },
    },
    locales: {
        IE: {
            countryCode: "IE",
            decimalSeparator: ".",
        },
        NL: {
            countryCode: "NL",
            decimalSeparator: ",",
        },
    },
};
var getLocale = function (locale) {
    if (locale === void 0) { locale = exports.config.defaultLocale; }
    return (__assign({}, exports.config.locales[locale]));
};
exports.getLocale = getLocale;
var getCurrency = function (currency) {
    if (currency === void 0) { currency = exports.config.defaultCurrency; }
    return (__assign({}, exports.config.currencies[currency]));
};
exports.getCurrency = getCurrency;
var getDefaultRounder = function () {
    switch (exports.config.defaultRoundingMethod) {
        case "bankers":
            return helpers_1.roundBank;
        case "up":
            return Math.ceil;
        case "down":
            return Math.floor;
        case "round":
            return Math.round;
        default:
            return helpers_1.roundBank;
    }
};
exports.getDefaultRounder = getDefaultRounder;
var validate = function (c) {
    if (!c) {
        throw new Error("money lib config invalid");
    }
};
var setConfig = function (c) {
    validate(Object.assign(exports.config, c));
};
exports.setConfig = setConfig;
