import { ethers, getAddress } from 'ethers';
import * as inputTypes from './V2HubFunctionInputTypes';
import contractAbi from './V2HubAbi.json';
import { V2HubFunctionName } from './V2HubFunctionNames';

export class V2HubDecoders {
    private readonly contractInterface: ethers.Interface = ethers.Interface.from(contractAbi);









    decodeToInflationAmountInputs(callData: string): inputTypes.ToInflationAmountInputs {
    const decoded = this.contractInterface.decodeFunctionData('ToInflationAmount', callData);
      return {
              _amount: BigInt(decoded[0].toString()),
      _timestamp: BigInt(decoded[1].toString())
      };
    };

    decodeAvatarsInputs(callData: string): inputTypes.AvatarsInputs {
    const decoded = this.contractInterface.decodeFunctionData('avatars', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeBalanceOfInputs(callData: string): inputTypes.BalanceOfInputs {
    const decoded = this.contractInterface.decodeFunctionData('balanceOf', callData);
      return {
              _account: getAddress(decoded[0]),
      _id: BigInt(decoded[1].toString())
      };
    };
    decodeBalanceOfBatchInputs(callData: string): inputTypes.BalanceOfBatchInputs {
    const decoded = this.contractInterface.decodeFunctionData('balanceOfBatch', callData);
      return {
              _accounts: decoded[0].map((x: any) => getAddress(x)),
      _ids: decoded[1].map((x: any) => BigInt(x.toString()))
      };
    };
    decodeBalanceOfOnDayInputs(callData: string): inputTypes.BalanceOfOnDayInputs {
    const decoded = this.contractInterface.decodeFunctionData('balanceOfOnDay', callData);
      return {
              _account: getAddress(decoded[0]),
      _id: BigInt(decoded[1].toString()),
      _day: BigInt(decoded[2].toString())
      };
    };
    decodeBurnInputs(callData: string): inputTypes.BurnInputs {
    const decoded = this.contractInterface.decodeFunctionData('burn', callData);
      return {
              _id: BigInt(decoded[0].toString()),
      _amount: BigInt(decoded[1].toString()),
      _data: ethers.getBytes(decoded[2])
      };
    };
    decodeCalculateIssuanceInputs(callData: string): inputTypes.CalculateIssuanceInputs {
    const decoded = this.contractInterface.decodeFunctionData('calculateIssuance', callData);
      return {
              _human: getAddress(decoded[0])
      };
    };
    decodeConvertBatchInflationaryToDemurrageValuesInputs(callData: string): inputTypes.ConvertBatchInflationaryToDemurrageValuesInputs {
    const decoded = this.contractInterface.decodeFunctionData('convertBatchInflationaryToDemurrageValues', callData);
      return {
              _inflationaryValues: decoded[0].map((x: any) => BigInt(x.toString())),
      _day: BigInt(decoded[1].toString())
      };
    };
    decodeConvertInflationaryToDemurrageValueInputs(callData: string): inputTypes.ConvertInflationaryToDemurrageValueInputs {
    const decoded = this.contractInterface.decodeFunctionData('convertInflationaryToDemurrageValue', callData);
      return {
              _inflationaryValue: BigInt(decoded[0].toString()),
      _day: BigInt(decoded[1].toString())
      };
    };
    decodeCreateERC20InflationWrapperInputs(callData: string): inputTypes.CreateERC20InflationWrapperInputs {
    const decoded = this.contractInterface.decodeFunctionData('createERC20InflationWrapper', callData);
      return {
              _tokenId: BigInt(decoded[0].toString()),
      _name: decoded[1],
      _symbol: decoded[2]
      };
    };
    decodeDayInputs(callData: string): inputTypes.DayInputs {
    const decoded = this.contractInterface.decodeFunctionData('day', callData);
      return {
              _timestamp: BigInt(decoded[0].toString())
      };
    };
    decodeGetDeterministicAddressInputs(callData: string): inputTypes.GetDeterministicAddressInputs {
    const decoded = this.contractInterface.decodeFunctionData('getDeterministicAddress', callData);
      return {
              _tokenId: BigInt(decoded[0].toString()),
      _bytecodeHash: ethers.getBytes(decoded[1])
      };
    };
    decodeGroupMintInputs(callData: string): inputTypes.GroupMintInputs {
    const decoded = this.contractInterface.decodeFunctionData('groupMint', callData);
      return {
              _group: getAddress(decoded[0]),
      _collateral: decoded[1].map((x: any) => getAddress(x)),
      _amounts: decoded[2].map((x: any) => BigInt(x.toString())),
      _data: ethers.getBytes(decoded[3])
      };
    };


    decodeInflationaryBalanceOfInputs(callData: string): inputTypes.InflationaryBalanceOfInputs {
    const decoded = this.contractInterface.decodeFunctionData('inflationaryBalanceOf', callData);
      return {
              _account: getAddress(decoded[0]),
      _id: BigInt(decoded[1].toString())
      };
    };
    decodeInflationaryBalanceOfBatchInputs(callData: string): inputTypes.InflationaryBalanceOfBatchInputs {
    const decoded = this.contractInterface.decodeFunctionData('inflationaryBalanceOfBatch', callData);
      return {
              _accounts: decoded[0].map((x: any) => getAddress(x)),
      _ids: decoded[1].map((x: any) => BigInt(x.toString()))
      };
    };

    decodeInviteHumanInputs(callData: string): inputTypes.InviteHumanInputs {
    const decoded = this.contractInterface.decodeFunctionData('inviteHuman', callData);
      return {
              _human: getAddress(decoded[0])
      };
    };
    decodeIsApprovedForAllInputs(callData: string): inputTypes.IsApprovedForAllInputs {
    const decoded = this.contractInterface.decodeFunctionData('isApprovedForAll', callData);
      return {
              _account: getAddress(decoded[0]),
      _operator: getAddress(decoded[1])
      };
    };
    decodeIsGroupInputs(callData: string): inputTypes.IsGroupInputs {
    const decoded = this.contractInterface.decodeFunctionData('isGroup', callData);
      return {
              _group: getAddress(decoded[0])
      };
    };
    decodeIsHumanInputs(callData: string): inputTypes.IsHumanInputs {
    const decoded = this.contractInterface.decodeFunctionData('isHuman', callData);
      return {
              _human: getAddress(decoded[0])
      };
    };
    decodeIsOrganizationInputs(callData: string): inputTypes.IsOrganizationInputs {
    const decoded = this.contractInterface.decodeFunctionData('isOrganization', callData);
      return {
              _organization: getAddress(decoded[0])
      };
    };
    decodeIsTrustedInputs(callData: string): inputTypes.IsTrustedInputs {
    const decoded = this.contractInterface.decodeFunctionData('isTrusted', callData);
      return {
              _truster: getAddress(decoded[0]),
      _trustee: getAddress(decoded[1])
      };
    };
    decodeIsValidNameInputs(callData: string): inputTypes.IsValidNameInputs {
    const decoded = this.contractInterface.decodeFunctionData('isValidName', callData);
      return {
              _name: decoded[0]
      };
    };
    decodeIsValidSymbolInputs(callData: string): inputTypes.IsValidSymbolInputs {
    const decoded = this.contractInterface.decodeFunctionData('isValidSymbol', callData);
      return {
              _symbol: decoded[0]
      };
    };
    decodeMigrateInputs(callData: string): inputTypes.MigrateInputs {
    const decoded = this.contractInterface.decodeFunctionData('migrate', callData);
      return {
              _owner: getAddress(decoded[0]),
      _avatars: decoded[1].map((x: any) => getAddress(x)),
      _amounts: decoded[2].map((x: any) => BigInt(x.toString()))
      };
    };

    decodeMintPoliciesInputs(callData: string): inputTypes.MintPoliciesInputs {
    const decoded = this.contractInterface.decodeFunctionData('mintPolicies', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeMintTimesInputs(callData: string): inputTypes.MintTimesInputs {
    const decoded = this.contractInterface.decodeFunctionData('mintTimes', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeNamesInputs(callData: string): inputTypes.NamesInputs {
    const decoded = this.contractInterface.decodeFunctionData('names', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };


    decodeRegisterCustomGroupInputs(callData: string): inputTypes.RegisterCustomGroupInputs {
    const decoded = this.contractInterface.decodeFunctionData('registerCustomGroup', callData);
      return {
              _mint: getAddress(decoded[0]),
      _treasury: getAddress(decoded[1]),
      _name: decoded[2],
      _symbol: decoded[3],
      _cidV0Digest: ethers.getBytes(decoded[4])
      };
    };
    decodeRegisterGroupInputs(callData: string): inputTypes.RegisterGroupInputs {
    const decoded = this.contractInterface.decodeFunctionData('registerGroup', callData);
      return {
              _mint: getAddress(decoded[0]),
      _name: decoded[1],
      _symbol: decoded[2],
      _cidV0Digest: ethers.getBytes(decoded[3])
      };
    };
    decodeRegisterHumanInputs(callData: string): inputTypes.RegisterHumanInputs {
    const decoded = this.contractInterface.decodeFunctionData('registerHuman', callData);
      return {
              _cidV0Digest: ethers.getBytes(decoded[0])
      };
    };
    decodeRegisterOrganizationInputs(callData: string): inputTypes.RegisterOrganizationInputs {
    const decoded = this.contractInterface.decodeFunctionData('registerOrganization', callData);
      return {
              _name: decoded[0],
      _cidV0Digest: ethers.getBytes(decoded[1])
      };
    };
    decodeSafeBatchTransferFromInputs(callData: string): inputTypes.SafeBatchTransferFromInputs {
    const decoded = this.contractInterface.decodeFunctionData('safeBatchTransferFrom', callData);
      return {
              _from: getAddress(decoded[0]),
      _to: getAddress(decoded[1]),
      _ids: decoded[2].map((x: any) => BigInt(x.toString())),
      _values: decoded[3].map((x: any) => BigInt(x.toString())),
      _data: ethers.getBytes(decoded[4])
      };
    };
    decodeSafeInflationaryBatchTransferFromInputs(callData: string): inputTypes.SafeInflationaryBatchTransferFromInputs {
    const decoded = this.contractInterface.decodeFunctionData('safeInflationaryBatchTransferFrom', callData);
      return {
              _from: getAddress(decoded[0]),
      _to: getAddress(decoded[1]),
      _ids: decoded[2].map((x: any) => BigInt(x.toString())),
      _inflationaryValues: decoded[3].map((x: any) => BigInt(x.toString())),
      _data: ethers.getBytes(decoded[4])
      };
    };
    decodeSafeInflationaryTransferFromInputs(callData: string): inputTypes.SafeInflationaryTransferFromInputs {
    const decoded = this.contractInterface.decodeFunctionData('safeInflationaryTransferFrom', callData);
      return {
              _from: getAddress(decoded[0]),
      _to: getAddress(decoded[1]),
      _id: BigInt(decoded[2].toString()),
      _inflationaryValue: BigInt(decoded[3].toString()),
      _data: ethers.getBytes(decoded[4])
      };
    };
    decodeSafeTransferFromInputs(callData: string): inputTypes.SafeTransferFromInputs {
    const decoded = this.contractInterface.decodeFunctionData('safeTransferFrom', callData);
      return {
              _from: getAddress(decoded[0]),
      _to: getAddress(decoded[1]),
      _id: BigInt(decoded[2].toString()),
      _value: BigInt(decoded[3].toString()),
      _data: ethers.getBytes(decoded[4])
      };
    };
    decodeSetApprovalForAllInputs(callData: string): inputTypes.SetApprovalForAllInputs {
    const decoded = this.contractInterface.decodeFunctionData('setApprovalForAll', callData);
      return {
              _operator: getAddress(decoded[0]),
      _approved: decoded[1]
      };
    };
    decodeSetIpfsCidV0Inputs(callData: string): inputTypes.SetIpfsCidV0Inputs {
    const decoded = this.contractInterface.decodeFunctionData('setIpfsCidV0', callData);
      return {
              _ipfsCid: ethers.getBytes(decoded[0])
      };
    };



    decodeStoppedInputs(callData: string): inputTypes.StoppedInputs {
    const decoded = this.contractInterface.decodeFunctionData('stopped', callData);
      return {
              _human: getAddress(decoded[0])
      };
    };
    decodeSupportsInterfaceInputs(callData: string): inputTypes.SupportsInterfaceInputs {
    const decoded = this.contractInterface.decodeFunctionData('supportsInterface', callData);
      return {
              _interfaceId: ethers.getBytes(decoded[0])
      };
    };
    decodeSymbolsInputs(callData: string): inputTypes.SymbolsInputs {
    const decoded = this.contractInterface.decodeFunctionData('symbols', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeToDemurrageAmountInputs(callData: string): inputTypes.ToDemurrageAmountInputs {
    const decoded = this.contractInterface.decodeFunctionData('toDemurrageAmount', callData);
      return {
              _amount: BigInt(decoded[0].toString()),
      _timestamp: BigInt(decoded[1].toString())
      };
    };
    decodeToTokenIdInputs(callData: string): inputTypes.ToTokenIdInputs {
    const decoded = this.contractInterface.decodeFunctionData('toTokenId', callData);
      return {
              _avatar: getAddress(decoded[0])
      };
    };
    decodeTokenIDToInfERC20Inputs(callData: string): inputTypes.TokenIDToInfERC20Inputs {
    const decoded = this.contractInterface.decodeFunctionData('tokenIDToInfERC20', callData);
      return {
              arg0: BigInt(decoded[0].toString())
      };
    };
    decodeTokenIdToCidV0DigestInputs(callData: string): inputTypes.TokenIdToCidV0DigestInputs {
    const decoded = this.contractInterface.decodeFunctionData('tokenIdToCidV0Digest', callData);
      return {
              arg0: BigInt(decoded[0].toString())
      };
    };
    decodeTreasuriesInputs(callData: string): inputTypes.TreasuriesInputs {
    const decoded = this.contractInterface.decodeFunctionData('treasuries', callData);
      return {
              arg0: getAddress(decoded[0])
      };
    };
    decodeTrustInputs(callData: string): inputTypes.TrustInputs {
    const decoded = this.contractInterface.decodeFunctionData('trust', callData);
      return {
              _trustReceiver: getAddress(decoded[0]),
      _expiry: BigInt(decoded[1].toString())
      };
    };
    decodeTrustMarkersInputs(callData: string): inputTypes.TrustMarkersInputs {
    const decoded = this.contractInterface.decodeFunctionData('trustMarkers', callData);
      return {
              arg0: getAddress(decoded[0]),
      arg1: getAddress(decoded[1])
      };
    };
    decodeUnwrapInflationaryERC20Inputs(callData: string): inputTypes.UnwrapInflationaryERC20Inputs {
    const decoded = this.contractInterface.decodeFunctionData('unwrapInflationaryERC20', callData);
      return {
              _tokenId: BigInt(decoded[0].toString()),
      _amount: BigInt(decoded[1].toString())
      };
    };
    decodeUriInputs(callData: string): inputTypes.UriInputs {
    const decoded = this.contractInterface.decodeFunctionData('uri', callData);
      return {
              _id: BigInt(decoded[0].toString())
      };
    };

    decodeWrapInflationaryERC20Inputs(callData: string): inputTypes.WrapInflationaryERC20Inputs {
    const decoded = this.contractInterface.decodeFunctionData('wrapInflationaryERC20', callData);
      return {
              _tokenId: BigInt(decoded[0].toString()),
      _amount: BigInt(decoded[1].toString())
      };
    };
 
    decode(callData: string): inputTypes.V2HubFunctionInputs {
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

      switch (<V2HubFunctionName>functionFragment.name) {
            case 'ToInflationAmount':
        return this.decodeToInflationAmountInputs(callData);
            case 'avatars':
        return this.decodeAvatarsInputs(callData);
            case 'balanceOf':
        return this.decodeBalanceOfInputs(callData);
            case 'balanceOfBatch':
        return this.decodeBalanceOfBatchInputs(callData);
            case 'balanceOfOnDay':
        return this.decodeBalanceOfOnDayInputs(callData);
            case 'burn':
        return this.decodeBurnInputs(callData);
            case 'calculateIssuance':
        return this.decodeCalculateIssuanceInputs(callData);
            case 'convertBatchInflationaryToDemurrageValues':
        return this.decodeConvertBatchInflationaryToDemurrageValuesInputs(callData);
            case 'convertInflationaryToDemurrageValue':
        return this.decodeConvertInflationaryToDemurrageValueInputs(callData);
            case 'createERC20InflationWrapper':
        return this.decodeCreateERC20InflationWrapperInputs(callData);
            case 'day':
        return this.decodeDayInputs(callData);
            case 'getDeterministicAddress':
        return this.decodeGetDeterministicAddressInputs(callData);
            case 'groupMint':
        return this.decodeGroupMintInputs(callData);
            case 'inflationaryBalanceOf':
        return this.decodeInflationaryBalanceOfInputs(callData);
            case 'inflationaryBalanceOfBatch':
        return this.decodeInflationaryBalanceOfBatchInputs(callData);
            case 'inviteHuman':
        return this.decodeInviteHumanInputs(callData);
            case 'isApprovedForAll':
        return this.decodeIsApprovedForAllInputs(callData);
            case 'isGroup':
        return this.decodeIsGroupInputs(callData);
            case 'isHuman':
        return this.decodeIsHumanInputs(callData);
            case 'isOrganization':
        return this.decodeIsOrganizationInputs(callData);
            case 'isTrusted':
        return this.decodeIsTrustedInputs(callData);
            case 'isValidName':
        return this.decodeIsValidNameInputs(callData);
            case 'isValidSymbol':
        return this.decodeIsValidSymbolInputs(callData);
            case 'migrate':
        return this.decodeMigrateInputs(callData);
            case 'mintPolicies':
        return this.decodeMintPoliciesInputs(callData);
            case 'mintTimes':
        return this.decodeMintTimesInputs(callData);
            case 'names':
        return this.decodeNamesInputs(callData);
            case 'registerCustomGroup':
        return this.decodeRegisterCustomGroupInputs(callData);
            case 'registerGroup':
        return this.decodeRegisterGroupInputs(callData);
            case 'registerHuman':
        return this.decodeRegisterHumanInputs(callData);
            case 'registerOrganization':
        return this.decodeRegisterOrganizationInputs(callData);
            case 'safeBatchTransferFrom':
        return this.decodeSafeBatchTransferFromInputs(callData);
            case 'safeInflationaryBatchTransferFrom':
        return this.decodeSafeInflationaryBatchTransferFromInputs(callData);
            case 'safeInflationaryTransferFrom':
        return this.decodeSafeInflationaryTransferFromInputs(callData);
            case 'safeTransferFrom':
        return this.decodeSafeTransferFromInputs(callData);
            case 'setApprovalForAll':
        return this.decodeSetApprovalForAllInputs(callData);
            case 'setIpfsCidV0':
        return this.decodeSetIpfsCidV0Inputs(callData);
            case 'stopped':
        return this.decodeStoppedInputs(callData);
            case 'supportsInterface':
        return this.decodeSupportsInterfaceInputs(callData);
            case 'symbols':
        return this.decodeSymbolsInputs(callData);
            case 'toDemurrageAmount':
        return this.decodeToDemurrageAmountInputs(callData);
            case 'toTokenId':
        return this.decodeToTokenIdInputs(callData);
            case 'tokenIDToInfERC20':
        return this.decodeTokenIDToInfERC20Inputs(callData);
            case 'tokenIdToCidV0Digest':
        return this.decodeTokenIdToCidV0DigestInputs(callData);
            case 'treasuries':
        return this.decodeTreasuriesInputs(callData);
            case 'trust':
        return this.decodeTrustInputs(callData);
            case 'trustMarkers':
        return this.decodeTrustMarkersInputs(callData);
            case 'unwrapInflationaryERC20':
        return this.decodeUnwrapInflationaryERC20Inputs(callData);
            case 'uri':
        return this.decodeUriInputs(callData);
            case 'wrapInflationaryERC20':
        return this.decodeWrapInflationaryERC20Inputs(callData);
      
      default:
        throw new Error(`Unknown function name '${functionFragment.name}' the code is out of sync with the ABI`);
    }
  }
  
}

