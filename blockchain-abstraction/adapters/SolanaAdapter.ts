import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
  
  import { ChainAdapter } from "../interfaces/ChainAdapter";
  import { DeployConfig, DeploymentResult } from "../interfaces/types";
  
  export class SolanaAdapter implements ChainAdapter {
    private connection: Connection;
    private signer: Keypair;
  
    constructor(rpcUrl: string, secretKey: Uint8Array) {
      this.connection = new Connection(rpcUrl, "confirmed");
      this.signer = Keypair.fromSecretKey(secretKey);
    }
  
    async connect(): Promise<void> {
      await this.connection.getLatestBlockhash(); // health check
    }
  
    // contract deployment not supported yet cuz can't be done with @solana/web3.js
    async deployContract(config: DeployConfig): Promise<DeploymentResult> {
      throw new Error("deployContract() not implemented for Solana in this adapter");
    }
  
    async sendTransaction(to: string, value: string): Promise<{ hash: string }> {
      const toPubKey = new PublicKey(to);
      const lamports = parseFloat(value) * LAMPORTS_PER_SOL;
  
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.signer.publicKey,
          toPubkey: toPubKey,
          lamports,
        })
      );
  
      const signature = await sendAndConfirmTransaction(this.connection, tx, [this.signer]);
      return { hash: signature };
    }
  
    async getTransactionStatus(txHash: string): Promise<string | null> {
      const status = await this.connection.getSignatureStatus(txHash);
      return status.value?.confirmationStatus || null;
    }
  
    async getBalance(address?: string): Promise<number> {
      const pubkey = address ? new PublicKey(address) : this.signer.publicKey;
      const lamports = await this.connection.getBalance(pubkey);
      return lamports / LAMPORTS_PER_SOL;
    }
  
    getAddress(): string {
      return this.signer.publicKey.toBase58();
    }
  }
  