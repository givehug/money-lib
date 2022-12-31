import money, { Money } from ".";

const m = money()
  .debug()
  .add({ amount: 4499, currency: "EUR" })
  .subtract({ amount: 299, currency: "EUR" })
  .debug()
  .multiply(5.56399)
  .divide(5.56399)
  .format();

console.log(m);
