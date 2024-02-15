import { ethers } from 'ethers';

export interface Provider {
  initializeProvider: () => Promise<void>;
  call: (args: { to: string, data: string }) => Promise<string>;
  sendTransaction: (args: { to: string, data: string }) => Promise<ethers.TransactionResponse>;
}