import { BigNumberish, ethers, keccak256 } from "ethers";
import TimeCircleAbi from "@circles-sdk-v2/circles-v2-abi/abi/TimeCircle.json"; // Adjust this import to the correct location of your ABI file

export class ContractInterface {
  private static readonly contractInterface = ethers.Interface.from(TimeCircleAbi);

  static readonly eventTopics = {
    Approval: keccak256(Buffer.from("Approval(address,address,uint256)")),
    DiscountCost: keccak256(Buffer.from("DiscountCost(address,uint256)")),
    Stopped: keccak256(Buffer.from("Stopped()")),
    Transfer: keccak256(Buffer.from("Transfer(address,address,uint256)")),
  };

  static DECIMALS(): string {
    return this.contractInterface.encodeFunctionData("DECIMALS", []);
  }

  static DISCOUNT_WINDOW(): string {
    return this.contractInterface.encodeFunctionData("DISCOUNT_WINDOW", []);
  }

  static GAMMA_64x64(): string {
    return this.contractInterface.encodeFunctionData("GAMMA_64x64", []);
  }

  static ISSUANCE_PERIOD(): string {
    return this.contractInterface.encodeFunctionData("ISSUANCE_PERIOD", []);
  }

  static MAX_CLAIM_DURATION(): string {
    return this.contractInterface.encodeFunctionData("MAX_CLAIM_DURATION", []);
  }

  static MAX_ISSUANCE(): string {
    return this.contractInterface.encodeFunctionData("MAX_ISSUANCE", []);
  }

  static SENTINEL_MIGRATION(): string {
    return this.contractInterface.encodeFunctionData("SENTINEL_MIGRATION", []);
  }

  static allowance(owner: string, spender: string): string {
    return this.contractInterface.encodeFunctionData("allowance", [owner, spender]);
  }

  static approve(spender: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("approve", [spender, amount]);
  }

  static avatar(): string {
    return this.contractInterface.encodeFunctionData("avatar", []);
  }

  static balanceOf(owner: string): string {
    return this.contractInterface.encodeFunctionData("balanceOf", [owner]);
  }

  static balanceTimeSpans(address: string): string {
    return this.contractInterface.encodeFunctionData("balanceTimeSpans", [address]);
  }

  static burn(amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("burn", [amount]);
  }

  static calculateIssuance(): string {
    return this.contractInterface.encodeFunctionData("calculateIssuance", []);
  }

  static claimIssuance(): string {
    return this.contractInterface.encodeFunctionData("claimIssuance", []);
  }

  static creationTime(): string {
    return this.contractInterface.encodeFunctionData("creationTime", []);
  }

  static decreaseAllowance(spender: string, decreaseAmount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("decreaseAllowance", [spender, decreaseAmount]);
  }

  static entity(): string {
    return this.contractInterface.encodeFunctionData("entity", []);
  }

  static graph(): string {
    return this.contractInterface.encodeFunctionData("graph", []);
  }

  static increaseAllowance(spender: string, incrementAmount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("increaseAllowance", [spender, incrementAmount]);
  }

  static lastIssuanceTimeSpan(): string {
    return this.contractInterface.encodeFunctionData("lastIssuanceTimeSpan", []);
  }

  static lastIssued(): string {
    return this.contractInterface.encodeFunctionData("lastIssued", []);
  }

  static migrate(owner: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("migrate", [owner, amount]);
  }

  static pathTransfer(from: string, to: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("pathTransfer", [from, to, amount]);
  }

  static setup(avatar: string): string {
    return this.contractInterface.encodeFunctionData("setup", [avatar]);
  }

  static stop(): string {
    return this.contractInterface.encodeFunctionData("stop", []);
  }

  static stopped(): string {
    return this.contractInterface.encodeFunctionData("stopped", []);
  }

  static temporalBalances(address: string): string {
    return this.contractInterface.encodeFunctionData("temporalBalances", [address]);
  }

  static totalSupply(): string {
    return this.contractInterface.encodeFunctionData("totalSupply", []);
  }

  static transfer(to: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("transfer", [to, amount]);
  }

  static transferFrom(from: string, to: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("transferFrom", [from, to, amount]);
  }
}
