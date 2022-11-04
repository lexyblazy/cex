import { DERIVATION_PATHS } from "./constants";
import { SUPPORTED_COINS } from "./types";

export const getDerivationPath = (symbol: SUPPORTED_COINS) => {
  return DERIVATION_PATHS[symbol];
};
