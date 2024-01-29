import {BigNumberish, ethers, keccak256} from "ethers";
import GraphAbi from "@circles-sdk-v2/circles-v2-abi/abi/Graph.json";

export class Graph {
  private static readonly contractInterface = ethers.Interface.from(GraphAbi);

  static readonly eventTopics = {
    RegisterAvatar: keccak256(Buffer.from("RegisterAvatar(address,address)")),
    RegisterOrganization: keccak256(Buffer.from("RegisterOrganization(address)")),
    RegisterGroup: keccak256(Buffer.from("RegisterGroup(address,int128)")),
    Trust: keccak256(Buffer.from("Trust(address,address,uint256)")),
  }

  static registerAvatar() : string {
    return this.contractInterface.encodeFunctionData("registerAvatar", []);
  }

  static authorizeGraphOperator(operator: string, expiryAuthorization: BigNumberish) : string {
    return this.contractInterface.encodeFunctionData("authorizeGraphOperator", [operator, expiryAuthorization]);
  }

  static registerGroup(exitFee_64x64: BigNumberish) {
    return this.contractInterface.encodeFunctionData("registerGroup", [exitFee_64x64]);
  }

  static registerOrganization() : string {
    return this.contractInterface.encodeFunctionData("registerOrganization", []);
  }

  static revokeGraphOperator(operator: string) : string {
    return this.contractInterface.encodeFunctionData("revokeGraphOperator", [operator]);
  }

  static trust(entity: string) : string {
    return this.contractInterface.encodeFunctionData("trust", [entity]);
  }

  static trustWithExpiry(entity: string, expiry: BigNumberish) : string {
    return this.contractInterface.encodeFunctionData("trustWithExpiry", [entity, expiry]);
  }

  static untrust(entity: string) : string {
    return this.contractInterface.encodeFunctionData("untrust", [entity]);
  }

  static isGraphOperator(entity: string, operator: string): string {
    return this.contractInterface.encodeFunctionData("isGraphOperator", [entity, operator]);
  }

  static isGraphOperatorForSet(operator: string, circleNodes: string[]): string {
    return this.contractInterface.encodeFunctionData("isGraphOperatorForSet", [operator, circleNodes]);
  }

  static isTrusted(truster: string, trusted: string): string {
    return this.contractInterface.encodeFunctionData("isTrusted", [truster, trusted]);
  }

  static getGraphOperatorExpiry(entity: string, operator: string): string {
    return this.contractInterface.encodeFunctionData("getGraphOperatorExpiry", [entity, operator]);
  }

  static getTrustExpiry(truster: string, trusted: string): BigNumberish {
    return this.contractInterface.encodeFunctionData("getTrustExpiry", [truster, trusted]);
  }

  static masterCopyAvatarCircleNode(): string {
    return this.contractInterface.encodeFunctionData("masterCopyAvatarCircleNode", []);
  }

  static masterCopyGroupCircleNode(): string {
    return this.contractInterface.encodeFunctionData("masterCopyGroupCircleNode", []);
  }

  static mintSplitter(): string {
    return this.contractInterface.encodeFunctionData("mintSplitter", []);
  }

  static avatarCircleNodesIterable(circleNode: string): string {
    return this.contractInterface.encodeFunctionData("avatarCircleNodesIterable", [circleNode]);
  }

  static avatarToCircle(avatar: string): string {
    return this.contractInterface.encodeFunctionData("avatarToCircle", [avatar]);
  }

  static checkAllAreTrustedCircleNodes(group: string, circles: string[], includeGroups: boolean): string {
    return this.contractInterface.encodeFunctionData("checkAllAreTrustedCircleNodes", [group, circles, includeGroups]);
  }

  static circleNodeForEntity(entity: string): string {
    return this.contractInterface.encodeFunctionData("circleNodeForEntity", [entity]);
  }

  static circleToAvatar(node: string): string {
    return this.contractInterface.encodeFunctionData("circleToAvatar", [node]);
  }

  static entityForCircleNode(circleNode: string): string {
    return this.contractInterface.encodeFunctionData("entityForCircleNode", [circleNode]);
  }

  static globalAllowances(entity: string, spender: string): string {
    return this.contractInterface.encodeFunctionData("globalAllowances", [entity, spender]);
  }

  static groupCircleNodesIterable(circleNode: string): string {
    return this.contractInterface.encodeFunctionData("groupCircleNodesIterable", [circleNode]);
  }

  static groupToCircle(group: string): string {
    return this.contractInterface.encodeFunctionData("groupToCircle", [group]);
  }

  static organizations(organization: string): string {
    return this.contractInterface.encodeFunctionData("organizations", [organization]);
  }

  static authorizedGraphOperators(entity: string, operator: string): string {
    return this.contractInterface.encodeFunctionData("authorizedGraphOperators", [entity, operator]);
  }

  static AVATAR_CIRCLE_SETUP_CALLPREFIX(): string {
    return this.contractInterface.encodeFunctionData("AVATAR_CIRCLE_SETUP_CALLPREFIX", []);
  }

  static GROUP_CIRCLE_SETUP_CALLPREFIX(): string {
    return this.contractInterface.encodeFunctionData("GROUP_CIRCLE_SETUP_CALLPREFIX", []);
  }

  static INDEFINITELY(): string {
    return this.contractInterface.encodeFunctionData("INDEFINITELY", []);
  }

  static OPERATOR_INTERVAL(): string {
    return this.contractInterface.encodeFunctionData("OPERATOR_INTERVAL", []);
  }

  static SENTINEL(): string {
    return this.contractInterface.encodeFunctionData("SENTINEL", []);
  }

  static ancestorCircleMigrator(): string {
    return this.contractInterface.encodeFunctionData("ancestorCircleMigrator", []);
  }
}

