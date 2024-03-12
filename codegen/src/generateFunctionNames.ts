import { OutputBuffer } from './outputBuffer.js';

export const generateFunctionNames = (contractName: string, output: OutputBuffer, functionInputTypeMap: Map<string, string | undefined>): void => {
  let functionNames = '';
  for (const functionName of functionInputTypeMap.keys()) {
    functionNames += `'${functionName}': null,\n    `;
  }

  output.writeLine(`export const ${contractName}FunctionNames = {
    ${functionNames}
}
export type ${contractName}FunctionName = keyof typeof ${contractName}FunctionNames;
`);
};