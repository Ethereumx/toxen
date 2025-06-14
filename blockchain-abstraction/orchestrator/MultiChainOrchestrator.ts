// orchestrator/MultiChainOrchestrator.ts

import { ChainAdapter } from "../interfaces/ChainAdapter";
import { DeployConfig, DeploymentResult } from "../interfaces/types";

export class MultiChainOrchestrator {
  constructor(private adapters: Map<string, ChainAdapter>) {}

  async connectAll(): Promise<void> {
    for (const adapter of this.adapters.values()) {
      await adapter.connect();
    }
  }

  async deploy(chainId: string, config: DeployConfig): Promise<DeploymentResult> {
    const adapter = this.adapters.get(chainId);
    if (!adapter) {
      throw new Error(`No adapter registered for chain: ${chainId}`);
    }

    return await adapter.deployContract(config);
  }

  async send(chainId: string, to: string, value: string) {
    const adapter = this.adapters.get(chainId);
    if (!adapter) {
      throw new Error(`No adapter registered for chain: ${chainId}`);
    }

    return await adapter.sendTransaction(to, value);
  }

  async getStatus(chainId: string, txHash: string) {
    const adapter = this.adapters.get(chainId);
    if (!adapter) {
      throw new Error(`No adapter registered for chain: ${chainId}`);
    }

    return await adapter.getTransactionStatus(txHash);
  }

  async getBalance(chainId: string, address?: string): Promise<number> {
    const adapter = this.adapters.get(chainId);
    if (!adapter) {
      throw new Error(`No adapter registered for chain: ${chainId}`);
    }

    return await adapter.getBalance(address);
  }
}
