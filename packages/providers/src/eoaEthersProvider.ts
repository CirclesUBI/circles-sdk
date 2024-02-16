import { ethers } from 'ethers';
import { Provider } from './provider';

export class EoaEthersProvider implements Provider {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly signer: ethers.Signer;

  constructor(provider: ethers.JsonRpcProvider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  initializeProvider: () => Promise<void> = async () => {
    return;
  };

  async call(args: { to: string, data: string }): Promise<string> {
    return await this.provider.call(args);
  }

  async sendTransaction(args: { to: string, data: string }): Promise<ethers.TransactionResponse> {
    return await this.signer.sendTransaction(args);
  }
}