import { Network } from "../../codegen";

import { getSdk as optimismSdk } from "./__generated__/Optimism.server";
import { getSdk as optimismSepoliaSdk } from "./__generated__/Optimism-sepolia.server";

export default {
  [Network.Optimism]: optimismSdk,
  [Network.OptimismSepolia]: optimismSepoliaSdk,
};