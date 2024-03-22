import { ethers } from 'ethers';
import * as inputTypes from './MigrationFunctionInputTypes';
import contractAbi from './MigrationAbi.json';

export class MigrationCalls {
    private readonly contractInterface: ethers.Interface = new ethers.Interface(contractAbi);

        convertFromV1ToDemurrage(params: inputTypes.ConvertFromV1ToDemurrageInputs): string {
        return this.contractInterface.encodeFunctionData('convertFromV1ToDemurrage', [params._amount]);
    }

    deployedAt(): string {
        return this.contractInterface.encodeFunctionData('deployedAt', []);
    }

    hubV1(): string {
        return this.contractInterface.encodeFunctionData('hubV1', []);
    }

    migrate(params: inputTypes.MigrateInputs): string {
        return this.contractInterface.encodeFunctionData('migrate', [params._avatars, params._amounts, params._hubV2]);
    }

    period(): string {
        return this.contractInterface.encodeFunctionData('period', []);
    }

}

