// adapters/EthereumAdapter.ts

import { ethers } from "ethers";
import { ChainAdapter, DeploymentResult } from "../interfaces/ChainAdapter";
import { DeployConfig } from "../interfaces/DeployConfig";

export class EthereumAdapter implements ChainAdapter {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  constructor(rpcUrl: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  async connect(): Promise<void> {
    await this.provider.getBlockNumber(); // health check
  }

  async deployContract(config: DeployConfig): Promise<DeploymentResult> {
    if (config.type !== "evm") {
      throw new Error("Invalid deploy config for Ethereum");
    }

    const { abi, bytecode, constructorArgs = [] } = config.payload;

    const factory = new ethers.ContractFactory(abi, bytecode, this.signer);
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment();

    return {
      address: await contract.getAddress(),
      txHash: contract.deploymentTransaction()?.hash || "",
    };
  }

  async sendTransaction(to: string, value: string): Promise<{ hash: string; status?: any }> {
    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(value),
    });
    const receipt = await tx.wait();
    return { hash: tx.hash, status: receipt?.status };
  }

  async getTransactionStatus(txHash: string): Promise<any> {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    return receipt?.status ?? null;
  }

  async getBalance(address?: string): Promise<number> {
    const target = address || this.signer.address;
    const balance = await this.provider.getBalance(target);
    return Number(ethers.formatEther(balance));
  }

  getAddress(): string {
    return this.signer.address;
  }
}
