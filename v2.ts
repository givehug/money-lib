export type { Money, Cents } from "./lib/types";

import * as v2 from "./lib/chainV2";
import { defaultConfig } from "./lib/config";

export const { money } = v2.setupMoney(defaultConfig);

export const setupMoney = v2.setupMoney;
