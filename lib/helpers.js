"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundBank = void 0;
/**
 * "Banker's Rounding" - to minimize bias
 */
var roundBank = function (n, places) {
    if (places === void 0) { places = 0; }
    var factor = Math.pow(10, places);
    var roundedNumber = n * factor;
    var roundedDown = Math.floor(roundedNumber);
    var roundedUp = Math.ceil(roundedNumber);
    var decimalPart = roundedNumber - roundedDown;
    var isHalfway = Math.abs(decimalPart - 0.5) < Number.EPSILON;
    if (isHalfway) {
        var isLeftDigitEven = roundedDown % 2 === 0;
        return isLeftDigitEven ? roundedDown / factor : roundedUp / factor;
    }
    return Math.round(n * factor) / factor;
};
exports.roundBank = roundBank;
