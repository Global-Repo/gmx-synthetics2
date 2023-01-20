import { createDeployFunction } from "../utils/deploy";

const func = createDeployFunction({
  contractName: "ExecuteDepositUtils",
  libraryNames: [
    "GasUtils",
    "FeeUtils",
    "MarketStoreUtils",
    "MarketEventUtils",
    "DepositStoreUtils",
    "DepositEventUtils",
  ],
});

export default func;
