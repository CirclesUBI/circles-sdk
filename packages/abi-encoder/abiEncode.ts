import { Interface } from "ethers";

export interface AbiEncoder {
  encodeCallData(
    abi: any,
    functionName: string,
    args?: any[]
  ): Promise<string>;
}

export class EthersAbiEncoder implements AbiEncoder {
  async encodeCallData(
    abi: any,
    functionName: string,
    args: any[] = []
  ): Promise<string> {
    try {
      const ethersInterface = new Interface(abi);
      return ethersInterface.encodeFunctionData(functionName, args);
    } catch (error) {
      throw new Error(`Failed to encode call data: ${(error as Error).message}`);
    }
  }
}

