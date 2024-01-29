import { BigNumberish, ethers } from "ethers";
import GraphAbi from "@circles-sdk-v2/circles-v2-abi/abi/Graph.json";

export class Graph {
  private static readonly contractInterface = ethers.Interface.from(GraphAbi);

  static registerAvatar(): string {
    return this.contractInterface.encodeFunctionData("registerAvatar", []);
  }

  static authorizeGraphOperator(operator: string, expiryAuthorization: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("authorizeGraphOperator", [operator, expiryAuthorization]);
  }

  static registerGroup(exitFee_64x64: BigNumberish) {
    return this.contractInterface.encodeFunctionData("registerGroup", [exitFee_64x64]);
  }

  static registerOrganization(): string {
    return this.contractInterface.encodeFunctionData("registerOrganization", []);
  }

  static revokeGraphOperator(operator: string): string {
    return this.contractInterface.encodeFunctionData("revokeGraphOperator", [operator]);
  }

  static trust(entity: string): string {
    return this.contractInterface.encodeFunctionData("trust", [entity]);
  }
}

