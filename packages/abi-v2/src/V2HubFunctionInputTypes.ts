export type ToInflationAmountInputs = {
  _amount: bigint;
  _timestamp: bigint;
};

export type AvatarsInputs = {
  arg0: string;
};

export type BalanceOfInputs = {
  _account: string;
  _id: bigint;
};

export type BalanceOfBatchInputs = {
  _accounts: string[];
  _ids: bigint[];
};

export type BalanceOfOnDayInputs = {
  _account: string;
  _id: bigint;
  _day: bigint;
};

export type BurnInputs = {
  _id: bigint;
  _amount: bigint;
  _data: Uint8Array;
};

export type CalculateIssuanceInputs = {
  _human: string;
};

export type ConvertBatchInflationaryToDemurrageValuesInputs = {
  _inflationaryValues: bigint[];
  _day: bigint;
};

export type ConvertInflationaryToDemurrageValueInputs = {
  _inflationaryValue: bigint;
  _day: bigint;
};

export type CreateERC20InflationWrapperInputs = {
  _tokenId: bigint;
  _name: string;
  _symbol: string;
};

export type DayInputs = {
  _timestamp: bigint;
};

export type GetDeterministicAddressInputs = {
  _tokenId: bigint;
  _bytecodeHash: Uint8Array;
};

export type GroupMintInputs = {
  _group: string;
  _collateral: string[];
  _amounts: bigint[];
  _data: Uint8Array;
};

export type InflationaryBalanceOfInputs = {
  _account: string;
  _id: bigint;
};

export type InflationaryBalanceOfBatchInputs = {
  _accounts: string[];
  _ids: bigint[];
};

export type InviteHumanInputs = {
  _human: string;
};

export type IsApprovedForAllInputs = {
  _account: string;
  _operator: string;
};

export type IsGroupInputs = {
  _group: string;
};

export type IsHumanInputs = {
  _human: string;
};

export type IsOrganizationInputs = {
  _organization: string;
};

export type IsTrustedInputs = {
  _truster: string;
  _trustee: string;
};

export type IsValidNameInputs = {
  _name: string;
};

export type IsValidSymbolInputs = {
  _symbol: string;
};

export type MigrateInputs = {
  _owner: string;
  _avatars: string[];
  _amounts: bigint[];
};

export type MintPoliciesInputs = {
  arg0: string;
};

export type MintTimesInputs = {
  arg0: string;
};

export type NamesInputs = {
  arg0: string;
};

export type RegisterCustomGroupInputs = {
  _mint: string;
  _treasury: string;
  _name: string;
  _symbol: string;
  _cidV0Digest: Uint8Array;
};

export type RegisterGroupInputs = {
  _mint: string;
  _name: string;
  _symbol: string;
  _cidV0Digest: Uint8Array;
};

export type RegisterHumanInputs = {
  _cidV0Digest: Uint8Array;
};

export type RegisterOrganizationInputs = {
  _name: string;
  _cidV0Digest: Uint8Array;
};

export type SafeBatchTransferFromInputs = {
  _from: string;
  _to: string;
  _ids: bigint[];
  _values: bigint[];
  _data: Uint8Array;
};

export type SafeInflationaryBatchTransferFromInputs = {
  _from: string;
  _to: string;
  _ids: bigint[];
  _inflationaryValues: bigint[];
  _data: Uint8Array;
};

export type SafeInflationaryTransferFromInputs = {
  _from: string;
  _to: string;
  _id: bigint;
  _inflationaryValue: bigint;
  _data: Uint8Array;
};

export type SafeTransferFromInputs = {
  _from: string;
  _to: string;
  _id: bigint;
  _value: bigint;
  _data: Uint8Array;
};

export type SetApprovalForAllInputs = {
  _operator: string;
  _approved: boolean;
};

export type SetIpfsCidV0Inputs = {
  _ipfsCid: Uint8Array;
};

export type StoppedInputs = {
  _human: string;
};

export type SupportsInterfaceInputs = {
  _interfaceId: Uint8Array;
};

export type SymbolsInputs = {
  arg0: string;
};

export type ToDemurrageAmountInputs = {
  _amount: bigint;
  _timestamp: bigint;
};

export type ToTokenIdInputs = {
  _avatar: string;
};

export type TokenIDToInfERC20Inputs = {
  arg0: bigint;
};

export type TokenIdToCidV0DigestInputs = {
  arg0: bigint;
};

export type TreasuriesInputs = {
  arg0: string;
};

export type TrustInputs = {
  _trustReceiver: string;
  _expiry: bigint;
};

export type TrustMarkersInputs = {
  arg0: string;
  arg1: string;
};

export type UnwrapInflationaryERC20Inputs = {
  _tokenId: bigint;
  _amount: bigint;
};

export type UriInputs = {
  _id: bigint;
};

export type WrapInflationaryERC20Inputs = {
  _tokenId: bigint;
  _amount: bigint;
};

export type NoInputs = [];
  
export type V2HubFunctionInputs = 
  | ToInflationAmountInputs
  | AvatarsInputs
  | BalanceOfInputs
  | BalanceOfBatchInputs
  | BalanceOfOnDayInputs
  | BurnInputs
  | CalculateIssuanceInputs
  | ConvertBatchInflationaryToDemurrageValuesInputs
  | ConvertInflationaryToDemurrageValueInputs
  | CreateERC20InflationWrapperInputs
  | DayInputs
  | GetDeterministicAddressInputs
  | GroupMintInputs
  | InflationaryBalanceOfInputs
  | InflationaryBalanceOfBatchInputs
  | InviteHumanInputs
  | IsApprovedForAllInputs
  | IsGroupInputs
  | IsHumanInputs
  | IsOrganizationInputs
  | IsTrustedInputs
  | IsValidNameInputs
  | IsValidSymbolInputs
  | MigrateInputs
  | MintPoliciesInputs
  | MintTimesInputs
  | NamesInputs
  | RegisterCustomGroupInputs
  | RegisterGroupInputs
  | RegisterHumanInputs
  | RegisterOrganizationInputs
  | SafeBatchTransferFromInputs
  | SafeInflationaryBatchTransferFromInputs
  | SafeInflationaryTransferFromInputs
  | SafeTransferFromInputs
  | SetApprovalForAllInputs
  | SetIpfsCidV0Inputs
  | StoppedInputs
  | SupportsInterfaceInputs
  | SymbolsInputs
  | ToDemurrageAmountInputs
  | ToTokenIdInputs
  | TokenIDToInfERC20Inputs
  | TokenIdToCidV0DigestInputs
  | TreasuriesInputs
  | TrustInputs
  | TrustMarkersInputs
  | UnwrapInflationaryERC20Inputs
  | UriInputs
  | WrapInflationaryERC20Inputs
  | NoInputs;
