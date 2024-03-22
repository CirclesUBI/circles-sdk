import { MigrationCalls } from './MigrationEncoders';
import { ethers, TransactionRequest, TransactionResponse } from 'ethers';
import { Observable } from "./common";

export class Migration {
  readonly address: string;
  private readonly provider: ethers.Provider;
  

  private callEncoder: MigrationCalls = new MigrationCalls(); 

  constructor(provider: ethers.Provider, address: string) {
      this.provider = provider;
      this.address = address;
      
  
  }
  
  private sendTransaction(request: TransactionRequest) : Promise<TransactionResponse> {
    if (!this.provider.sendTransaction) {
      throw new Error('sendTransaction not available on this provider');
    }
    return this.provider.sendTransaction(request);
  }
  
  convertFromV1ToDemurrage = async (_amount: bigint): Promise<bigint> => {
      return BigInt(await this.provider.call({
      to: this.address,
      data: this.callEncoder.convertFromV1ToDemurrage({ _amount: _amount })
    }));
    };
deployedAt = async (): Promise<bigint> => {
      return BigInt(await this.provider.call({
      to: this.address,
      data: this.callEncoder.deployedAt()
    }));
    };
hubV1 = async (): Promise<string> => {
      return await (async () => { const val = await this.provider.call({
      to: this.address,
      data: this.callEncoder.hubV1()
    }); return val == "0x" ? ethers.ZeroAddress : ethers.getAddress(val.slice(-40)); })();
    };
period = async (): Promise<bigint> => {
      return BigInt(await this.provider.call({
      to: this.address,
      data: this.callEncoder.period()
    }));
    };
  migrate = async (_avatars: string[], _amounts: bigint[], _hubV2: string): Promise<ethers.TransactionReceipt | null> => {
       const tx = await this.sendTransaction({
         to: this.address,
         data: this.callEncoder.migrate({ _avatars: _avatars, _amounts: _amounts, _hubV2: _hubV2 })
      });
      return tx.wait();
    }

}
