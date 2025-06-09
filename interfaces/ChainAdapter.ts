import { DeployConfig } from "./DeployConfig";

export interface DeploymentResult {
    address: string;
    txHash: string;
  }
  
export interface ChainAdapter {
    connect(): Promise<void>;
    deployContract(config: DeployConfig): Promise<DeploymentResult>;
    sendTransaction(to: string, value: string): Promise<{ hash: string; status?: any }>;
    getTransactionStatus(txHash: string): Promise<any>;
    getBalance(address?: string): Promise<number>;
    getAddress(): string;
  }
  