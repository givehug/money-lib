# Changelog

## v1.3.1 (2023-06-09)

#### Fix

- fixed return type of chained `formatParts` (added sign field)

## v1.3.0 (2023-06-07)

#### Feature

- added `fromIntString`, `fromFloatString` methods

## v1.1.0 (2023-05-30)

#### Fix

- formatting values of less than 10 cents

## v1.0.0 (2023-05-30)

#### Breaking

- changed output of `format`, `formatParts`
- made `currency` optional in money initialization (defaults to config.defaultCurrency)
