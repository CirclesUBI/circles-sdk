export type TransferIntent = {
    from: string;
    to: string;
    amount: bigint;
};

export type TransferPathStep = {
    from: string;
    to: string;
    tokenOwner: string;
    amount: bigint;
};

export type TransferPath = {
    amount: bigint;
    path: TransferPathStep[];
};