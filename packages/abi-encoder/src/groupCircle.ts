import { BigNumberish, ethers, keccak256 } from "ethers";
import GroupCircleAbi from "@circles-sdk-v2/circles-v2-abi/abi/GroupCircle.json"; // Adjust the path to where your ABI is located

export class GroupCircle {
  private static readonly contractInterface = ethers.Interface.from(GroupCircleAbi);

  static readonly eventTopics = {
    Approval: keccak256(Buffer.from("Approval(address,address,uint256)")),
    DiscountCost: keccak256(Buffer.from("DiscountCost(address,uint256)")),
    Transfer: keccak256(Buffer.from("Transfer(address,address,uint256)"))
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

  static allowance(owner: string, spender: string): string {
    return this.contractInterface.encodeFunctionData("allowance", [owner, spender]);
  }

  static approve(spender: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("approve", [spender, amount]);
  }

  static balanceOf(owner: string): string {
    return this.contractInterface.encodeFunctionData("balanceOf", [owner]);
  }

  static balanceTimeSpans(owner: string): string {
    return this.contractInterface.encodeFunctionData("balanceTimeSpans", [owner]);
  }

  static burn(amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("burn", [amount]);
  }

  static burnCollateralUponMinting(): string {
    return this.contractInterface.encodeFunctionData("burnCollateralUponMinting", []);
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

  static exitFee_64x64(): string {
    return this.contractInterface.encodeFunctionData("exitFee_64x64", []);
  }

  static graph(): string {
    return this.contractInterface.encodeFunctionData("graph", []);
  }

  static group(): string {
    return this.contractInterface.encodeFunctionData("group", []);
  }

  static increaseAllowance(spender: string, incrementAmount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("increaseAllowance", [spender, incrementAmount]);
  }

  static mint(collateral: string[], amount: BigNumberish[]): string {
    return this.contractInterface.encodeFunctionData("mint", [collateral, amount]);
  }

  static pathTransfer(from: string, to: string, amount: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("pathTransfer", [from, to, amount]);
  }

  static setup(group: string, exitFee_64x64: BigNumberish): string {
    return this.contractInterface.encodeFunctionData("setup", [group, exitFee_64x64]);
  }

  static temporalBalances(owner: string): string {
    return this.contractInterface.encodeFunctionData("temporalBalances", [owner]);
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
