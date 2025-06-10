import { DeployConfig, DeploymentResult, TransactionResult } from "./types";

export interface ChainAdapter {
    connect(): Promise<void>;
    deployContract(config: DeployConfig): Promise<DeploymentResult>;
    sendTransaction(to: string, value: string): Promise<TransactionResult>;
    getTransactionStatus(txHash: string): Promise<any>;
    getBalance(address?: string): Promise<number>;
    getAddress(): string;
}