/**
 * "Banker's Rounding" - to minimize bias
 */
export const roundBank = (n: number, places = 0) => {
  const factor = 10 ** places;
  const roundedNumber = n * factor;
  const roundedDown = Math.floor(roundedNumber);
  const roundedUp = Math.ceil(roundedNumber);
  const decimalPart = roundedNumber - roundedDown;
  const isHalfway = Math.abs(decimalPart - 0.5) < Number.EPSILON;

  if (isHalfway) {
    const isLeftDigitEven = roundedDown % 2 === 0;
    return isLeftDigitEven ? roundedDown / factor : roundedUp / factor;
  }

  return Math.round(n * factor) / factor;
};
