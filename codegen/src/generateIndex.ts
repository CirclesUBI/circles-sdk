import { OutputBuffer } from './outputBuffer.js';

export const generateIndexFile = (contractName: string, output: OutputBuffer) => {
  output.writeLine(`import { Event, ParsedEvent, EventDecoder } from './common';
import { ${contractName}Decoders } from './${contractName}Decoders';
import * as inputTypes from './${contractName}FunctionInputTypes';
import { ${contractName}FunctionName, ${contractName}FunctionNames } from './${contractName}FunctionNames';
import { ${contractName}Calls } from './${contractName}Encoders';
import { ${contractName}Events } from './${contractName}Events';
import { ${contractName == '' || !contractName ? 'Wrapper' : contractName} } from './${contractName == '' || !contractName ? 'Wrapper' : contractName}';

export {
  Event,
  ParsedEvent,
  EventDecoder,
  ${contractName}Decoders,
  inputTypes as ${contractName}InputTypes,
  ${contractName}FunctionName,
  ${contractName}FunctionNames,
  ${contractName}Calls,
  ${contractName}Events,
  ${contractName == '' || !contractName ? 'Wrapper' : contractName},
};`);
};