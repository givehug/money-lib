import { money } from "../index";

/**
 * Optimizations:
 * - cache Intl.NumberFormat per locale (1kk fmts ~17s -> ~2s / 8.5x)
 */

function main() {
  // bun 2s
  // Array(1_000_000)
  //   .fill("100 eur" as const)
  //   .forEach((s) => {
  //     money(s).fmt();
  //   });
  // // bun 2s same as fmt !?
  // Array(1_000_000)
  //   .fill("100 eur" as const)
  //   .forEach((s) => {
  //     money(s).fmts();
  //   });
  // // bun 2s
  // Array(1_000_000)
  //   .fill("100 eur")
  //   .forEach((s) => {
  //     money().parse(s).fmt();
  //   });
  // // bun 0.6s
  // Array(1_000_000)
  //   .fill(100)
  //   .forEach((s) => {
  //     money(s).fmt();
  //   });
  // // bun 1.5s
  // Array(1_000_000)
  //   .fill("100")
  //   .forEach((s) => {
  //     money(s).int();
  //   });
  // // bun 0.2s
  //   Array(1_000_000)
  //     .fill(100)
  //     .forEach((s) => {
  //       money(s).int();
  //     });
  // // bun 3.44s
  //   Array(1_000_000)
  //     .fill("100")
  //     .forEach((s) => {
  //       money(s).add("$5").mul(3).number();
  //     });
  // // bun 3.62s (276_243 ops/s)
  // Array(1_000_000)
  //   .fill("100")
  //   .forEach((s) => {
  //     money(`${s} cents`).add("$5").mul(3).number();
  //   });
}

main();
