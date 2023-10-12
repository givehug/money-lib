export type Cents = number;

export type Money = {
  amount: Cents; // Integer representing cents
  currency?: string; // Currency code (ISO 4217)
};
