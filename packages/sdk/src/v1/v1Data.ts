export type TransferHistoryItem = {
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  txHash: string;
};

export class V1Data {
  constructor(public readonly circlesRpcUrl: string) {
  }

  async queryIncomingTransfers(address: string): Promise<any[]> {
    const requestBody = {
      jsonrpc: '2.0',
      method: 'circles_queryCrcTransfers',
      params: [{
        ToAddress: address,
        Sort: 'desc'
      }],
      id: 1
    };

    const response = await fetch(this.circlesRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData?.result ? responseData.result : [];
  }

  async queryOutgoingTransfers(address: string): Promise<any[]> {
    const requestBody = {
      jsonrpc: '2.0',
      method: 'circles_queryCrcTransfers',
      params: [{
        FromAddress: address,
        Sort: 'desc'
      }],
      id: 2
    };

    const response = await fetch(this.circlesRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData?.result ? responseData.result : [];
  }

  async queryAllTransfers(address: string): Promise<any[]> {
    const incomingTransfers = await this.queryIncomingTransfers(address);
    const outgoingTransfers = await this.queryOutgoingTransfers(address);
    const allTransfers = incomingTransfers.concat(outgoingTransfers);
    return allTransfers.sort((a, b) => b.timestamp - a.timestamp);
  }

  async queryTrustRelations(address: string): Promise<{
    user: string,
    trusts: {
      [address: string]: number
    },
    trustedBy: {
      [address: string]: number
    }
  }> {
    const requestBody = {
      jsonrpc: '2.0',
      method: 'circles_getTrustRelations',
      params: [address],
      id: 1
    };

    const response = await fetch(this.circlesRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData?.result ? responseData.result : {};
  }

  async queryTrustEvents(address: string): Promise<any[]> {
    const requestBody = {
      jsonrpc: '2.0',
      method: 'circles_queryTrustEvents',
      "params":[{
        "UserAddress": address,
        "CanSendToAddress": address,
        "SortOrder": "Descending",
        "Mode": "Or"
      }],
      id: 1
    };

    const response = await fetch(this.circlesRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData?.result ? responseData.result : [];
  }

  queryAllTrusts(address: string) {
    return this.queryTrustEvents(address);
  }
}