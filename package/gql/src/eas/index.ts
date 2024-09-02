import { Network } from "../../codegen";

import { getSdkWithHooks as optimismSdk } from "./__generated__/Optimism";
import { getSdkWithHooks as optimismSepoliaSdk } from "./__generated__/Optimism-sepolia";

export default {
  [Network.Optimism]: optimismSdk,
  [Network.OptimismSepolia]: optimismSepoliaSdk,
};