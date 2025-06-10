import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { EthereumAdapter } from "../adapters/EthereumAdapter";
import { SolanaAdapter } from "../adapters/SolanaAdapter";
import { MultiChainOrchestrator } from "../orchestrator/MultiChainOrchestrator";
import { ChainAdapter } from "../interfaces/ChainAdapter";
import { DeployConfig } from "../interfaces/types";
import artifact from "./Mycontract.json";

// --- Load adapters ---
const ethAdapter = new EthereumAdapter(
  process.env.ETH_RPC!,
  process.env.ETH_PRIVATE_KEY!
);

const keypairRaw = process.env.SOLANA_KEYPAIR!;
const solSecretKey = Uint8Array.from(JSON.parse(keypairRaw));
const solAdapter = new SolanaAdapter(
  process.env.SOLANA_RPC!,
  solSecretKey
);
const orchestrator = new MultiChainOrchestrator(
  new Map<string, ChainAdapter>([
    ["ethereum", ethAdapter],
    ["solana", solAdapter],
  ])
);
const main = async () => {

  // === Ethereum transaction + deploy ===
  console.log("=== Ethereum ===");

  const ethBalance = await orchestrator.getBalance("ethereum");
  console.log("ETH Balance:", ethBalance);

  const ethTx = await orchestrator.send("ethereum", process.env.ETH_RECEIVER!, "0.0001");
  console.log("ETH Tx Hash:", ethTx.hash);

  const ethStatus = await orchestrator.getStatus("ethereum", ethTx.hash);
  console.log("ETH Tx Status:", ethStatus);

  // -- Deploy contract
  const abi = (artifact as any).abi;
  const bytecode = (artifact as any).data.bytecode.object;

  const deployConfig: DeployConfig = {
    type: "evm",
    payload: {
      abi,
      bytecode,
      constructorArgs: [] // Add if your contract requires constructor inputs
    }
  };

  const deployed = await orchestrator.deploy("ethereum", deployConfig);
  console.log("Contract deployed at:", deployed.address);
  console.log("Deployment Tx Hash:", deployed.txHash);

  // === Solana transfer ===
  console.log("\n=== Solana ===");

  const solBalance = await orchestrator.getBalance("solana");
  console.log("SOL Balance:", solBalance);

  const solTx = await orchestrator.send("solana", process.env.SOLANA_RECEIVER!, "0.1");
  console.log("SOL Tx Hash:", solTx.hash);

  const solStatus = await orchestrator.getStatus("solana", solTx.hash);
  console.log("SOL Tx Status:", solStatus);
};

main().catch(console.error);
