import { BigNumberish, ethers } from "ethers";
import MintSplitterAbi from "@circles-sdk-v2/circles-v2-abi/abi/MintSplitter.json"; // Replace with the correct path to your ABI file

export class YourContract {
  private static readonly contractInterface = ethers.Interface.from(MintSplitterAbi);

  static MAX_DISTRIBUTIONS(): string {
    return this.contractInterface.encodeFunctionData("MAX_DISTRIBUTIONS", []);
  }

  static ONE_64x64(): string {
    return this.contractInterface.encodeFunctionData("ONE_64x64", []);
  }

  static SENTINEL(): string {
    return this.contractInterface.encodeFunctionData("SENTINEL", []);
  }

  static UPDATE_RELAXATION_TIME_FEE(): string {
    return this.contractInterface.encodeFunctionData("UPDATE_RELAXATION_TIME_FEE", []);
  }

  static addsToOneUnit(allocations: BigNumberish[]): string {
    return this.contractInterface.encodeFunctionData("addsToOneUnit", [allocations]);
  }

  static allocationTowardsCaller(source: string): string {
    return this.contractInterface.encodeFunctionData("allocationTowardsCaller", [source]);
  }

  static checkSourceLockHubV1(source: string): string {
    return this.contractInterface.encodeFunctionData("checkSourceLockHubV1", [source]);
  }

  static destinations(address: string): string {
    return this.contractInterface.encodeFunctionData("destinations", [address]);
  }

  static distributions(source: string, destination: string): string {
    return this.contractInterface.encodeFunctionData("distributions", [source, destination]);
  }

  static hubV1(): string {
    return this.contractInterface.encodeFunctionData("hubV1", []);
  }

  static hubV1Locks(address: string): string {
    return this.contractInterface.encodeFunctionData("hubV1Locks", [address]);
  }

  static lastUpdatedDistribution(address: string): string {
    return this.contractInterface.encodeFunctionData("lastUpdatedDistribution", [address]);
  }

  static registerDistribution(destinations: string[], allocations: BigNumberish[]): string {
    return this.contractInterface.encodeFunctionData("registerDistribution", [destinations, allocations]);
  }

  static sourceSequences(address: string): string {
    return this.contractInterface.encodeFunctionData("sourceSequences", [address]);
  }

  static sources(address: string): string {
    return this.contractInterface.encodeFunctionData("sources", [address]);
  }
}
