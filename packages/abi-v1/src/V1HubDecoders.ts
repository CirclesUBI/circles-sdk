import { ethers, getAddress } from 'ethers';
import * as inputTypes from './V1HubFunctionInputTypes';
import contractAbi from './V1HubAbi.json';
import { V1HubFunctionName } from './V1HubFunctionNames';

export class V1HubDecoders {
    private readonly contractInterface: ethers.Interface = ethers.Interface.from(contractAbi);
    decodeCheckSendLimitInputs(callData: string): inputTypes.CheckSendLimitInputs {
    const decoded = this.contractInterface.decodeFunctionData('checkSendLimit', callData);
      return {
              tokenOwner: getAddress(decoded[0]),
      src: getAddress(decoded[1]),
      dest: getAddress(decoded[2])
      };
    };


    decodeInflateInputs(callData: string): inputTypes.InflateInputs {
    const decoded = this.contractInterface.decodeFunctionData('inflate', callData);
      return {
              _initial: BigInt(decoded[0].toString()),
      _periods: BigInt(decoded[1].toString())
      };
    };



    decodeIssuanceByStepInputs(callData: string): inputTypes.IssuanceByStepInputs {
    const decoded = this.contractInterface.decodeFunctionData('issuanceByStep', callData);
      return {
              _periods: BigInt(decoded[0].toString())
      };
    };
    decodeLimitsInputs(callData: string): inputTypes.LimitsInputs {
    const decoded = this.contractInterface.decodeFunctionData('limits', callData);
      return {
              arg0: getAddress(decoded[0]),
      arg1: getAddress(decoded[1])
      };
    };


    decodeOrganizationsInputs(callData: string): inputTypes.OrganizationsInputs {
    const decoded = this.contractInterface.decodeFunctionData('organizations', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };


    decodePowInputs(callData: string): inputTypes.PowInputs {
    const decoded = this.contractInterface.decodeFunctionData('pow', callData);
      return {
              base: BigInt(decoded[0].toString()),
      exponent: BigInt(decoded[1].toString())
      };
    };
    decodeSeenInputs(callData: string): inputTypes.SeenInputs {
    const decoded = this.contractInterface.decodeFunctionData('seen', callData);
      return {
              arg0: BigInt(decoded[0].toString())
      };
    };




    decodeTokenToUserInputs(callData: string): inputTypes.TokenToUserInputs {
    const decoded = this.contractInterface.decodeFunctionData('tokenToUser', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeTransferThroughInputs(callData: string): inputTypes.TransferThroughInputs {
    const decoded = this.contractInterface.decodeFunctionData('transferThrough', callData);
      return {
              tokenOwners: decoded[0].map((x: any) => getAddress(x)),
      srcs: decoded[1].map((x: any) => getAddress(x)),
      dests: decoded[2].map((x: any) => getAddress(x)),
      wads: decoded[3].map((x: any) => BigInt(x.toString()))
      };
    };
    decodeTrustInputs(callData: string): inputTypes.TrustInputs {
    const decoded = this.contractInterface.decodeFunctionData('trust', callData);
      return {
              user: getAddress(decoded[0]),
      limit: BigInt(decoded[1].toString())
      };
    };
    decodeUserToTokenInputs(callData: string): inputTypes.UserToTokenInputs {
    const decoded = this.contractInterface.decodeFunctionData('userToToken', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeValidationInputs(callData: string): inputTypes.ValidationInputs {
    const decoded = this.contractInterface.decodeFunctionData('validation', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
 
    decode(callData: string): inputTypes.V1HubFunctionInputs {
      if (callData.length < 10) {
        throw new Error(`Call data too short to encode a methodId: ${callData}`);
      }
      const methodId = callData.slice(0, 10);
      const functionFragment = this.contractInterface.getFunction(methodId);
      if (!functionFragment) {
        throw new Error(`Cannot find function fragment for methodId: ${methodId}. Call data: ${callData}`);
      }

      if (functionFragment.inputs.length === 0) {
        return <inputTypes.NoInputs>[];
      }

      switch (<V1HubFunctionName>functionFragment.name) {
            case 'checkSendLimit':
        return this.decodeCheckSendLimitInputs(callData);
            case 'inflate':
        return this.decodeInflateInputs(callData);
            case 'issuanceByStep':
        return this.decodeIssuanceByStepInputs(callData);
            case 'limits':
        return this.decodeLimitsInputs(callData);
            case 'organizations':
        return this.decodeOrganizationsInputs(callData);
            case 'pow':
        return this.decodePowInputs(callData);
            case 'seen':
        return this.decodeSeenInputs(callData);
            case 'tokenToUser':
        return this.decodeTokenToUserInputs(callData);
            case 'transferThrough':
        return this.decodeTransferThroughInputs(callData);
            case 'trust':
        return this.decodeTrustInputs(callData);
            case 'userToToken':
        return this.decodeUserToTokenInputs(callData);
            case 'validation':
        return this.decodeValidationInputs(callData);
      
      default:
        throw new Error(`Unknown function name '${functionFragment.name}' the code is out of sync with the ABI`);
    }
  }
  
}

