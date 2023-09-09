# Changelog

## v1.6.4 (2023-09-09)

#### Fix

- fix `toFloatString` 0 padding
- fix `fromIntString`
- fix `fromFloatString`

#### Chore

- exclude test files from build
- use bun for testing

## v1.6.3 (2023-08-22)

#### Fix

- expose `config` method

## v1.6.2 (2023-08-22)

#### Feature

- added `abs` method

## v1.6.1 (2023-08-20)

#### Feature

- added `withPlusSign` format() option, default: false; if true, positive numbers will be prefixed with a plus sign

## v1.6.0 (2023-08-02)

#### Feature

- use `Bankers Rounding` as default rounder when parsing floats (configurable in config)

## v1.5.0 (2023-07-28)

#### Feature

- `toCents` alias for `toInt`
- `min` and `max` methods

#### Fix

- default currency when initializing money chain

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
