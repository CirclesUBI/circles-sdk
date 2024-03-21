import { OutputBuffer } from './outputBuffer.js';
import { FunctionFragment, ParamType } from 'ethers';


function abiInputToCode(input: ParamType, code: string = '', i: number = 0): string {

  // Check the base type:
  // - uint, int, address, bool, bytes, string, tuple
  // - array
  const basicTypes = {
    uint: true,
    int: true,
    bytes: true,
    address: false,
    bool: false,
    string: false
  };

  if (input.baseType === 'array') {
    console.log(' '.repeat(i * 2) + `* Array type: ${input.format('full')}:`);
    const arrayChildren = abiInputToCode(input.arrayChildren, code, i + 1);
    return `  ${getInputName(input)}: ${arrayChildren}[]`;
  } else if (input.baseType.startsWith('tuple')) {
    console.log(' '.repeat(i * 2) + `* Tuple type: ${input.format('full')}`);
    const componentCode = input.components.map((component: ParamType) => {
      return abiInputToCode(component, code, i + 1);
    });
    return `  {\n${componentCode.join(`\n`)} }`;
  } else {
    for (const basicType of Object.entries(basicTypes)) {
      const typeName = basicType[0];
      const hasLengthSuffix = basicType[1];

      if (input.baseType.startsWith(basicType[0])) {
        console.log(' '.repeat(i * 2) + `* Basic type: ${input.format('full')}`);
        const lengthSuffix = hasLengthSuffix ? parseInt(input.baseType.slice(typeName.length)) : -1;
        const typescriptType = abiBasicTypeToTsType(input, typeName, lengthSuffix);
        console.log(' '.repeat(i * 2) + `  Mapped to:  ${typescriptType}`);

        code += `  ${i == 0 ? getInputName(input) + ':' : ''} ${typescriptType}`;
      }
    }
  }

  return code;
}

function abiBasicTypeToTsType(input: ParamType, typeName: string, lengthSuffix: number): string {
  if (lengthSuffix > 0 && typeName === 'uint' || typeName === 'int') {
    if (lengthSuffix <= 48) {
      return `number /*${lengthSuffix}*/`;
    }
    if (lengthSuffix <= 256) {
      return `bigint /*${lengthSuffix}*/`;
    }
    throw new Error(`Unsupported length for ${typeName} type: ${lengthSuffix}`);
  }
  if (lengthSuffix > 0 && typeName === 'bytes') {
    return `Uint8Array /*${lengthSuffix}*/`;
  }
  switch (input.baseType) {
    case 'address':
      return `Address`;
    case 'bool':
      return 'boolean';
    case 'bytes':
      return `Uint8Array`;
    case 'string':
      return 'string';
  }
}

const generateTypeDefinition = (contractName: string, functionAbi: any, typeName: string): string => {
  const propertiesCode = generatePropertyDefinitions(functionAbi).join('\n  ');


  for (const input of functionAbi.inputs) {
    console.log(abiInputToCode(input));
  }

  const complexProperties = functionAbi.inputs
    .map((o, i) => ({ o, i }))
    .filter((o) => o.o.components && o.o.components.length > 0);

  const complexPropertyTypeCode = complexProperties
    .map((o) => generateComplexPropertyType(contractName, o.o, o.i))
    .join('');

  const complexPropertiesCode = complexProperties
    .map((o) => generateComplexProperty(contractName, o.o, o.i))
    .join('');

  return `
${complexProperties.length > 0 ? '\n' + complexPropertyTypeCode : ''}
export type ${typeName} = {
  ${propertiesCode}
  ${complexProperties.length > 0 ? '\n  ' + complexPropertiesCode : ''}
};
`;
};

function generateComplexPropertyType(contractName: string, input: ParamType, index: number) {
  let code = `export type ${contractName}${getInputName(input, index)} = {\n`;
  input.components.forEach((component: ParamType, index: number) => {
    const tsType = solidityToTypeScriptTypes(component.type);
    const paramName = getInputName(component, index);
    code += `${paramName}: ${tsType};\n`;
  });
  code += `};\n`;
  return code;
}

function generateComplexProperty(contractName: string, input: ParamType, index: number) {
  return `${getInputName(input, index)}: ${contractName}${getInputName(input, index)};\n`;
}

function generatePropertyDefinitions(functionAbi: FunctionFragment) {
  const simpleProperties = functionAbi.inputs.filter(o => !o.components || o.components.length == 0);
  const simplePropertiesCode = simpleProperties.map((input: ParamType, index: number) => {
    const tsType = solidityToTypeScriptTypes(input.type);
    const paramName = getInputName(input, index);
    return `${paramName}: ${tsType};\n`;
  });

  const complexProperties = functionAbi.inputs.filter(o => o.components && o.components.length > 0);
  const complexPropertiesCode = complexProperties.map((input: ParamType, index: number) => {
    return generateComplexPropertyType(functionAbi.name, input, index);
  });

  return simplePropertiesCode.concat(complexPropertiesCode);
}

const solidityToTypeScriptTypes = (solidityType: string): string => {
  switch (true) {
    case solidityType.endsWith('[]'):
      return `${solidityToTypeScriptTypes(solidityType.slice(0, -2))}[]`;
    case solidityType.startsWith('uint') || solidityType.startsWith('int'):
      return 'bigint';
    case solidityType.startsWith('address'):
      return 'string';
    case solidityType.startsWith('bool'):
      return 'boolean';
    case solidityType.startsWith('bytes'):
      return 'Uint8Array';
    case solidityType.startsWith('string'):
      return 'string';
    default:
      return 'any'; // Fallback for complex types
  }
};


const getInputName = (type: ParamType, index?: number): string => {
  return type.name || `arg${index ?? 0}`;
};
/**
 * Generate the type definition for all function inputs.
 * @param contractName The name of the contract
 * @param output The file to write to
 * @param functionFragments The function fragments to generate types for
 * @returns A map of function names to their input type names
 */
export const generateFunctionInputTypes = (contractName: string, output: OutputBuffer, functionFragments: FunctionFragment[]): Map<string, string | undefined> => {
  const functionInputTypeMap: Map<string, string | undefined> = new Map();

  functionFragments.forEach((functionAbi) => {
    const functionName = functionAbi.name;
    functionInputTypeMap.set(functionName, undefined);
    if (!functionAbi.inputs.length) {
      return;
    }
    const typeName = `${functionAbi.name.charAt(0).toUpperCase()}${functionAbi.name.slice(1)}Inputs`;
    output.writeLine(generateTypeDefinition(contractName, functionAbi, typeName));
    functionInputTypeMap.set(functionName, typeName);
  });

  // Create a union type of all the function inputs
  output.writeLine(`export type NoInputs = [];
  
export type ${contractName}FunctionInputs = `);

  for (const typeName of functionInputTypeMap.values()) {
    if (!typeName) {
      continue;
    }
    output.writeLine(`  | ${typeName}`);
  }
  output.writeLine(`  | NoInputs;`);

  return functionInputTypeMap;
};