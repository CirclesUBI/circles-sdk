export type ConvertFromV1ToDemurrageInputs = {
  _amount: bigint;
};

export type MigrateInputs = {
  _avatars: string[];
  _amounts: bigint[];
  _hubV2: string;
};

export type NoInputs = [];
  
export type MigrationFunctionInputs = 
  | ConvertFromV1ToDemurrageInputs
  | MigrateInputs
  | NoInputs;
