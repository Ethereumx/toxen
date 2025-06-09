export interface DeployConfig {
    type: "evm" | "solana";
    payload: any; // Adapter will validate its own payload
  }