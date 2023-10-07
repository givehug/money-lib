import { money } from "../v2";

// formatting is way slower than other methods, ~50_000 ops/s

function main() {
  // bun 17s
  Array(1_000_000)
    .fill("100 eur" as const)
    .forEach((s) => {
      money(s).fmt();
    });
  // // bun 17s
  // Array(1_000_000)
  //   .fill("100 eur")
  //   .forEach((s) => {
  //     money().parse(s).fmt();
  //   });
  // bun 15s
  //   Array(1_000_000)
  //     .fill(100)
  //     .forEach((s) => {
  //       money(s).fmt();
  //     });
  // bun 1.5s
  //   Array(1_000_000)
  //     .fill("100")
  //     .forEach((s) => {
  //       money(s).int();
  //     });
  // bun 0.2s
  //   Array(1_000_000)
  //     .fill(100)
  //     .forEach((s) => {
  //       money(s).int();
  //     });
  // bun 3.44s
  //   Array(1_000_000)
  //     .fill("100")
  //     .forEach((s) => {
  //       money(s).add("$5").mul(3).number();
  //     });
}

main();
