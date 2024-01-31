import {BigNumberish, ethers, keccak256} from "ethers";
import HubAbi from "@circles-sdk-v2/circles-v2-abi/abi/Hub.json";

export class Hub {
  private static readonly contractInterface = ethers.Interface.from(HubAbi);

  static readonly eventTopics = {
    RegisterHuman: keccak256(Buffer.from("RegisterHuman(address)")),
    RegisterOrganization: keccak256(Buffer.from("RegisterOrganization(address)")),
    RegisterGroup: keccak256(Buffer.from("RegisterGroup(address)")),
    Trust: keccak256(Buffer.from("Trust(address,address,uint256)")),
  }

  static registerHuman() : string {
    return this.contractInterface.encodeFunctionData("registerHuman", []);
  }

  static registerGroup(treasury:string, name:string, symbol:string) {
    return this.contractInterface.encodeFunctionData("registerGroup", [
      treasury, name, symbol
    ]);
  }

  static registerOrganization(name:string) : string {
    return this.contractInterface.encodeFunctionData("registerOrganization", [name]);
  }

  static trust(trustReceiver: string, expiry: BigNumberish) : string {
    return this.contractInterface.encodeFunctionData("trust", [trustReceiver, expiry]);
  }
}

