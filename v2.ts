import * as v2 from "./lib/v2/chain";
import { defaultConfig } from "./lib/config";

export const { money } = v2.setupMoney(defaultConfig);

export const setupMoney = v2.setupMoney;
