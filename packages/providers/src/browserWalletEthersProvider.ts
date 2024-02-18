import { ethers } from 'ethers';
import { Provider } from './provider';

declare let window: any;

export class BrowserWalletEthersProvider implements Provider {
  private provider?: ethers.BrowserProvider;
  private signer?: ethers.Signer;

  public async initialize(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('No browser wallet like MetaMask installed.');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
  }

  async call(args: { to: string, data: string }): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    return await this.provider.call(args);
  }

  async sendTransaction(args: { to: string, data: string }): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Provider not initialized');
    return await this.signer.sendTransaction(args);
  }
}
