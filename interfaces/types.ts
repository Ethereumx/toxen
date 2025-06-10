export interface DeployConfig {
    type: "evm" | "solana";
    payload: any; // Adapter will validate its own payload
  }
  
  export interface DeploymentResult {
      address: string;
      txHash: string;
    }
  
  export interface TransactionResult {
      hash: string;
      status?: any;
    }