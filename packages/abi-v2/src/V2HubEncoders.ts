import { ethers } from 'ethers';
import * as inputTypes from './V2HubFunctionInputTypes';
import contractAbi from './V2HubAbi.json';

export class V2HubCalls {
    private readonly contractInterface: ethers.Interface = new ethers.Interface(contractAbi);

        CIRCLES_STOPPED_V1(): string {
        return this.contractInterface.encodeFunctionData('CIRCLES_STOPPED_V1', []);
    }

    DEMURRAGE_WINDOW(): string {
        return this.contractInterface.encodeFunctionData('DEMURRAGE_WINDOW', []);
    }

    INDEFINITE_FUTURE(): string {
        return this.contractInterface.encodeFunctionData('INDEFINITE_FUTURE', []);
    }

    INVITATION_COST(): string {
        return this.contractInterface.encodeFunctionData('INVITATION_COST', []);
    }

    ISSUANCE_PER_SECOND(): string {
        return this.contractInterface.encodeFunctionData('ISSUANCE_PER_SECOND', []);
    }

    MAX_CLAIM_DURATION(): string {
        return this.contractInterface.encodeFunctionData('MAX_CLAIM_DURATION', []);
    }

    MAX_VALUE(): string {
        return this.contractInterface.encodeFunctionData('MAX_VALUE', []);
    }

    MINIMUM_DONATION(): string {
        return this.contractInterface.encodeFunctionData('MINIMUM_DONATION', []);
    }

    SENTINEL(): string {
        return this.contractInterface.encodeFunctionData('SENTINEL', []);
    }

    ToInflationAmount(params: inputTypes.ToInflationAmountInputs): string {
        return this.contractInterface.encodeFunctionData('ToInflationAmount', [params._amount, params._timestamp]);
    }

    WELCOME_BONUS(): string {
        return this.contractInterface.encodeFunctionData('WELCOME_BONUS', []);
    }

    avatars(params: inputTypes.AvatarsInputs): string {
        return this.contractInterface.encodeFunctionData('avatars', [params.arg0]);
    }

    balanceOf(params: inputTypes.BalanceOfInputs): string {
        return this.contractInterface.encodeFunctionData('balanceOf', [params._account, params._id]);
    }

    balanceOfBatch(params: inputTypes.BalanceOfBatchInputs): string {
        return this.contractInterface.encodeFunctionData('balanceOfBatch', [params._accounts, params._ids]);
    }

    balanceOfOnDay(params: inputTypes.BalanceOfOnDayInputs): string {
        return this.contractInterface.encodeFunctionData('balanceOfOnDay', [params._account, params._id, params._day]);
    }

    burn(params: inputTypes.BurnInputs): string {
        return this.contractInterface.encodeFunctionData('burn', [params._id, params._amount, params._data]);
    }

    calculateIssuance(params: inputTypes.CalculateIssuanceInputs): string {
        return this.contractInterface.encodeFunctionData('calculateIssuance', [params._human]);
    }

    convertBatchInflationaryToDemurrageValues(params: inputTypes.ConvertBatchInflationaryToDemurrageValuesInputs): string {
        return this.contractInterface.encodeFunctionData('convertBatchInflationaryToDemurrageValues', [params._inflationaryValues, params._day]);
    }

    convertInflationaryToDemurrageValue(params: inputTypes.ConvertInflationaryToDemurrageValueInputs): string {
        return this.contractInterface.encodeFunctionData('convertInflationaryToDemurrageValue', [params._inflationaryValue, params._day]);
    }

    createERC20InflationWrapper(params: inputTypes.CreateERC20InflationWrapperInputs): string {
        return this.contractInterface.encodeFunctionData('createERC20InflationWrapper', [params._tokenId, params._name, params._symbol]);
    }

    day(params: inputTypes.DayInputs): string {
        return this.contractInterface.encodeFunctionData('day', [params._timestamp]);
    }

    getDeterministicAddress(params: inputTypes.GetDeterministicAddressInputs): string {
        return this.contractInterface.encodeFunctionData('getDeterministicAddress', [params._tokenId, params._bytecodeHash]);
    }

    groupMint(params: inputTypes.GroupMintInputs): string {
        return this.contractInterface.encodeFunctionData('groupMint', [params._group, params._collateral, params._amounts, params._data]);
    }

    hubV1(): string {
        return this.contractInterface.encodeFunctionData('hubV1', []);
    }

    inflation_day_zero(): string {
        return this.contractInterface.encodeFunctionData('inflation_day_zero', []);
    }

    inflationaryBalanceOf(params: inputTypes.InflationaryBalanceOfInputs): string {
        return this.contractInterface.encodeFunctionData('inflationaryBalanceOf', [params._account, params._id]);
    }

    inflationaryBalanceOfBatch(params: inputTypes.InflationaryBalanceOfBatchInputs): string {
        return this.contractInterface.encodeFunctionData('inflationaryBalanceOfBatch', [params._accounts, params._ids]);
    }

    invitationOnlyTime(): string {
        return this.contractInterface.encodeFunctionData('invitationOnlyTime', []);
    }

    inviteHuman(params: inputTypes.InviteHumanInputs): string {
        return this.contractInterface.encodeFunctionData('inviteHuman', [params._human]);
    }

    isApprovedForAll(params: inputTypes.IsApprovedForAllInputs): string {
        return this.contractInterface.encodeFunctionData('isApprovedForAll', [params._account, params._operator]);
    }

    isGroup(params: inputTypes.IsGroupInputs): string {
        return this.contractInterface.encodeFunctionData('isGroup', [params._group]);
    }

    isHuman(params: inputTypes.IsHumanInputs): string {
        return this.contractInterface.encodeFunctionData('isHuman', [params._human]);
    }

    isOrganization(params: inputTypes.IsOrganizationInputs): string {
        return this.contractInterface.encodeFunctionData('isOrganization', [params._organization]);
    }

    isTrusted(params: inputTypes.IsTrustedInputs): string {
        return this.contractInterface.encodeFunctionData('isTrusted', [params._truster, params._trustee]);
    }

    isValidName(params: inputTypes.IsValidNameInputs): string {
        return this.contractInterface.encodeFunctionData('isValidName', [params._name]);
    }

    isValidSymbol(params: inputTypes.IsValidSymbolInputs): string {
        return this.contractInterface.encodeFunctionData('isValidSymbol', [params._symbol]);
    }

    migrate(params: inputTypes.MigrateInputs): string {
        return this.contractInterface.encodeFunctionData('migrate', [params._owner, params._avatars, params._amounts]);
    }

    migration(): string {
        return this.contractInterface.encodeFunctionData('migration', []);
    }

    mintPolicies(params: inputTypes.MintPoliciesInputs): string {
        return this.contractInterface.encodeFunctionData('mintPolicies', [params.arg0]);
    }

    mintTimes(params: inputTypes.MintTimesInputs): string {
        return this.contractInterface.encodeFunctionData('mintTimes', [params.arg0]);
    }

    names(params: inputTypes.NamesInputs): string {
        return this.contractInterface.encodeFunctionData('names', [params.arg0]);
    }

    operatorPathTransfer(): string {
        return this.contractInterface.encodeFunctionData('operatorPathTransfer', []);
    }

    personalMint(): string {
        return this.contractInterface.encodeFunctionData('personalMint', []);
    }

    registerCustomGroup(params: inputTypes.RegisterCustomGroupInputs): string {
        return this.contractInterface.encodeFunctionData('registerCustomGroup', [params._mint, params._treasury, params._name, params._symbol, params._cidV0Digest]);
    }

    registerGroup(params: inputTypes.RegisterGroupInputs): string {
        return this.contractInterface.encodeFunctionData('registerGroup', [params._mint, params._name, params._symbol, params._cidV0Digest]);
    }

    registerHuman(params: inputTypes.RegisterHumanInputs): string {
        return this.contractInterface.encodeFunctionData('registerHuman', [params._cidV0Digest]);
    }

    registerOrganization(params: inputTypes.RegisterOrganizationInputs): string {
        return this.contractInterface.encodeFunctionData('registerOrganization', [params._name, params._cidV0Digest]);
    }

    safeBatchTransferFrom(params: inputTypes.SafeBatchTransferFromInputs): string {
        return this.contractInterface.encodeFunctionData('safeBatchTransferFrom', [params._from, params._to, params._ids, params._values, params._data]);
    }

    safeInflationaryBatchTransferFrom(params: inputTypes.SafeInflationaryBatchTransferFromInputs): string {
        return this.contractInterface.encodeFunctionData('safeInflationaryBatchTransferFrom', [params._from, params._to, params._ids, params._inflationaryValues, params._data]);
    }

    safeInflationaryTransferFrom(params: inputTypes.SafeInflationaryTransferFromInputs): string {
        return this.contractInterface.encodeFunctionData('safeInflationaryTransferFrom', [params._from, params._to, params._id, params._inflationaryValue, params._data]);
    }

    safeTransferFrom(params: inputTypes.SafeTransferFromInputs): string {
        return this.contractInterface.encodeFunctionData('safeTransferFrom', [params._from, params._to, params._id, params._value, params._data]);
    }

    setApprovalForAll(params: inputTypes.SetApprovalForAllInputs): string {
        return this.contractInterface.encodeFunctionData('setApprovalForAll', [params._operator, params._approved]);
    }

    setIpfsCidV0(params: inputTypes.SetIpfsCidV0Inputs): string {
        return this.contractInterface.encodeFunctionData('setIpfsCidV0', [params._ipfsCid]);
    }

    singleSourcePathTransfer(): string {
        return this.contractInterface.encodeFunctionData('singleSourcePathTransfer', []);
    }

    standardTreasury(): string {
        return this.contractInterface.encodeFunctionData('standardTreasury', []);
    }

    stop(): string {
        return this.contractInterface.encodeFunctionData('stop', []);
    }

    stopped(params: inputTypes.StoppedInputs): string {
        return this.contractInterface.encodeFunctionData('stopped', [params._human]);
    }

    supportsInterface(params: inputTypes.SupportsInterfaceInputs): string {
        return this.contractInterface.encodeFunctionData('supportsInterface', [params._interfaceId]);
    }

    symbols(params: inputTypes.SymbolsInputs): string {
        return this.contractInterface.encodeFunctionData('symbols', [params.arg0]);
    }

    toDemurrageAmount(params: inputTypes.ToDemurrageAmountInputs): string {
        return this.contractInterface.encodeFunctionData('toDemurrageAmount', [params._amount, params._timestamp]);
    }

    toTokenId(params: inputTypes.ToTokenIdInputs): string {
        return this.contractInterface.encodeFunctionData('toTokenId', [params._avatar]);
    }

    tokenIDToInfERC20(params: inputTypes.TokenIDToInfERC20Inputs): string {
        return this.contractInterface.encodeFunctionData('tokenIDToInfERC20', [params.arg0]);
    }

    tokenIdToCidV0Digest(params: inputTypes.TokenIdToCidV0DigestInputs): string {
        return this.contractInterface.encodeFunctionData('tokenIdToCidV0Digest', [params.arg0]);
    }

    treasuries(params: inputTypes.TreasuriesInputs): string {
        return this.contractInterface.encodeFunctionData('treasuries', [params.arg0]);
    }

    trust(params: inputTypes.TrustInputs): string {
        return this.contractInterface.encodeFunctionData('trust', [params._trustReceiver, params._expiry]);
    }

    trustMarkers(params: inputTypes.TrustMarkersInputs): string {
        return this.contractInterface.encodeFunctionData('trustMarkers', [params.arg0, params.arg1]);
    }

    unwrapInflationaryERC20(params: inputTypes.UnwrapInflationaryERC20Inputs): string {
        return this.contractInterface.encodeFunctionData('unwrapInflationaryERC20', [params._tokenId, params._amount]);
    }

    uri(params: inputTypes.UriInputs): string {
        return this.contractInterface.encodeFunctionData('uri', [params._id]);
    }

    wrapDemurrageERC20(): string {
        return this.contractInterface.encodeFunctionData('wrapDemurrageERC20', []);
    }

    wrapInflationaryERC20(params: inputTypes.WrapInflationaryERC20Inputs): string {
        return this.contractInterface.encodeFunctionData('wrapInflationaryERC20', [params._tokenId, params._amount]);
    }

}

