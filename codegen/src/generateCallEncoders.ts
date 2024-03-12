import { OutputBuffer } from './outputBuffer.js';
import { FunctionFragment } from 'ethers';
import { getInputName } from './utils.js';

const generateFunctionDefinition = (functionFragment: FunctionFragment, functionInputTypes: Map<string, string | undefined>): string => {
  const functionName = functionFragment.name;
  const inputType = functionInputTypes.get(functionName);
  let params = '';
  if (!inputType) {
    params = ``;
  } else {
    params = `params: inputTypes.${inputType}`;
  }
  const argsArray = functionFragment.inputs.map((input: any, index: number) => `params.${getInputName(input, index)}`).join(', ');
  return `    ${functionName}(${params}): string {
        return this.contractInterface.encodeFunctionData('${functionName}', [${argsArray}]);
    }
`;
};

export const generateCallEncoders = (contractName:string, output: OutputBuffer, functionFragments: FunctionFragment[], functionInputTypes: Map<string, string | undefined>): void => {
  const functions = functionFragments.map((functionAbi) => generateFunctionDefinition(functionAbi, functionInputTypes)).join('\n');

  output.writeLine(`import { ethers } from 'ethers';
import * as inputTypes from './${contractName}FunctionInputTypes';
import * as contractAbi from './${contractName}Abi.json';

export class ${contractName}Calls {
    private readonly contractInterface: ethers.Interface = new ethers.Interface(contractAbi);

    ${functions}
}
`);
};