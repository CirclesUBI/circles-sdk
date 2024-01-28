import { Contract, Interface, ethers } from "ethers";

export class GraphContract {
  private contract: Contract;
  private abiInterface: Interface;

  constructor(contractAddress: string, abi: ethers.InterfaceAbi, providerOrSigner: ethers.Provider | ethers.Signer) {
    this.contract = new Contract(contractAddress, abi, providerOrSigner);
    this.abiInterface = new Interface(abi);
  }

  private async sendTransaction(to: string, data: string) {
    // const encodedData = this.abiInterface.encodeFunctionData(functionName, args);
    const txRequest = {
      to: to,  // Ensure this is a string representing the contract address
      data: data,
    };

    if (!this.contract.signer) {
      throw new Error('No signer available');
    }


    if (!('sendTransaction' in this.contract.signer) || typeof this.contract.signer.sendTransaction !== 'function') {
      throw new Error('No sendTransaction function available');
    }

    const txResponse = await this.contract.signer.sendTransaction(txRequest);
    return txResponse.wait();
  }

  private async callRequest(functionName: string, args: any[]) {
    const encodedData = this.abiInterface.encodeFunctionData(functionName, args);
    const callRequest = {
      to: this.contract.address,
      data: encodedData,
    };
    return this.contract.provider.call(callRequest);
  }


  // State-changing functions
  async registerAvatar() {
    return this.sendTransaction('registerAvatar', []);
  }

  async registerGroup(exitFee: ethers.BigNumberish) {
    return this.sendTransaction('registerGroup', exitFee.toString());
  }

  async registerOrganization() {
    return this.sendTransaction('registerOrganization', []);
  }

  async trust(entity: string) {
    return this.sendTransaction('trust', entity);
  }

  async trustWithExpiry(entity: string, expiry: ethers.BigNumberish) {
    return this.sendTransaction('trustWithExpiry', [entity, expiry.toString()]);
  }

  async untrust(entity: string) {
    return this.sendTransaction('untrust', [entity]);
  }

  async authorizeGraphOperator(operator: string, expiryAuthorization: ethers.BigNumberish) {
    return this.sendTransaction('authorizeGraphOperator', [operator, expiryAuthorization]);
  }

  async revokeGraphOperator(operator: string) {
    return this.sendTransaction('revokeGraphOperator', [operator]);
  }

  async migrateCircles(owner: string, amount: ethers.BigNumberish, circleNode: ethers.Contract) {
    return this.sendTransaction('migrateCircles', [owner, amount, circleNode]);
  }

  async singlePathTransfer(senderCoordinateIndex: number, receiverCoordinateIndex: number, amount: ethers.BigNumberish, flowVertices: string[], flow: ethers.BigNumberish[], packedCoordinates: string) {
    return this.sendTransaction('singlePathTransfer', [senderCoordinateIndex, receiverCoordinateIndex, amount, flowVertices, flow, packedCoordinates]);
  }

  async operateFlowMatrix(intendedNettedFlow: ethers.BigNumberish[], flowVertices: string[], flow: ethers.BigNumberish[], packedCoordinates: string) {
    return this.sendTransaction('operateFlowMatrix', [intendedNettedFlow, flowVertices, flow, packedCoordinates]);
  }

  // Read-only functions
  async isTrusted(truster: string, trusted: string): Promise<boolean> {
    const result = await this.callRequest('isTrusted', [truster, trusted]);
    return this.abiInterface.decodeFunctionResult('isTrusted', result)[0];
  }

  async getTrustExpiry(truster: string, trusted: string): Promise<ethers.BigNumberish> {
    const result = await this.callRequest('getTrustExpiry', [truster, trusted]);
    return this.abiInterface.decodeFunctionResult('getTrustExpiry', result)[0];
  }

  async isGraphOperator(entity: string, operator: string): Promise<boolean> {
    const result = await this.callRequest('isGraphOperator', [entity, operator]);
    return this.abiInterface.decodeFunctionResult('isGraphOperator', result)[0];
  }

  async isGraphOperatorForSet(operator: string, circleNodes: string[]): Promise<boolean> {
    const result = await this.callRequest('isGraphOperatorForSet', [operator, circleNodes]);
    return this.abiInterface.decodeFunctionResult('isGraphOperatorForSet', result)[0];
  }

  async getGraphOperatorExpiry(entity: string, operator: string): Promise<ethers.BigNumberish> {
    const result = await this.callRequest('getGraphOperatorExpiry', [entity, operator]);
    return this.abiInterface.decodeFunctionResult('getGraphOperatorExpiry', result)[0];
  }

  async circleToAvatar(node: ethers.Contract): Promise<string> {
    const result = await this.callRequest('circleToAvatar', [node]);
    return this.abiInterface.decodeFunctionResult('circleToAvatar', result)[0];
  }

  async circleNodeForEntity(entity: string): Promise<ethers.Contract> {
    const result = await this.callRequest('circleNodeForEntity', [entity]);
    return this.abiInterface.decodeFunctionResult('circleNodeForEntity', result)[0];
  }

  async entityForCircleNode(circleNode: ethers.Contract): Promise<string> {
    const result = await this.callRequest('entityForCircleNode', [circleNode]);
    return this.abiInterface.decodeFunctionResult('entityForCircleNode', result)[0];
  }

  async fetchAllocation(avatar: string) {
    const result = await this.callRequest('fetchAllocation', [avatar]);
    return this.abiInterface.decodeFunctionResult('fetchAllocation', result);
  }

  async checkAllAreTrustedCircleNodes(group: string, circles: ethers.Contract[], includeGroups: boolean) {
    const result = await this.callRequest('checkAllAreTrustedCircleNodes', [group, circles, includeGroups]);
    return this.abiInterface.decodeFunctionResult('checkAllAreTrustedCircleNodes', result)[0];
  }
}
