<script lang="ts" context="module">
  export type BlockInfo = {
    currentBlock: number;
    currentTime: string;
  };
</script>
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ethers } from 'ethers';
  import { createEventDispatcher } from 'svelte';
  import Collapsible from './Collapsible.svelte';

  let rpcUrl: string = '';
  let provider: ethers.JsonRpcProvider;
  let anvilCurrentBlock: number;
  let anvilCurrentTime: string;
  // UI Bindings
  let miningMode: 'auto' | 'interval' | 'never' = 'auto';
  let blockTime = 0; // in seconds, applicable if miningMode is 'interval'
  let accountBalance = '10000'; // default balance for accounts in ETH
  let autoImpersonate = false;
  let gasPrice = '1'; // in gwei
  let gasLimit = '10000000'; // default gas limit
  let chainId = '31337'; // default chain ID for local development
  let snapshotId: string = '';
  let nodeInfo: string = ''; // To store node info as a JSON string
  let loggingEnabled: boolean = true; // Default logging state
  let increaseTimeBySeconds: number = 0; // Time to increase in the blockchain
  let nextBlockTimestamp: number = 0; // Timestamp for the next block

  const eventDispatcher = createEventDispatcher();

  onMount(async () => {
    provider = new ethers.JsonRpcProvider(rpcUrl);
    subscribeToNewBlocks();
    await fetchNodeInfo();
  });

  onDestroy(() => {
    provider?.removeAllListeners('block');
  });

  async function fetchBlockInfo(blockNumber?: number) {
    try {
      const number = blockNumber || await provider.getBlockNumber();
      anvilCurrentBlock = number;

      const block = await provider.getBlock(number);
      anvilCurrentTime = new Date(block.timestamp * 1000).toLocaleString();

      eventDispatcher("newBlock", <BlockInfo>{
        currentBlock: anvilCurrentBlock,
        currentTime: anvilCurrentTime
      });
    } catch (error) {
      console.error('Error fetching block info:', error);
    }
  }

  async function applySettings() {
    switch (miningMode) {
      case 'auto':
        await evmSetAutomine(true);
        break;
      case 'interval':
        if (blockTime > 0) {
          await evmSetIntervalMining(blockTime);
        }
        break;
      case 'never':
        await evmSetAutomine(false);
        break;
    }

    await anvilSetLoggingEnabled(loggingEnabled);
    if (increaseTimeBySeconds > 0) {
      await evmIncreaseTime(increaseTimeBySeconds);
    }
    if (nextBlockTimestamp > 0) {
      await evmSetNextBlockTimestamp(nextBlockTimestamp);
    }

    await fetchNodeInfo();
  }

  function subscribeToNewBlocks() {
    provider.on('block', (blockNumber: number) => {
      fetchBlockInfo(blockNumber);
    });
  }

  async function fetchNodeInfo() {
    try {
      const info = await provider.send('anvil_nodeInfo', []);
      nodeInfo = JSON.stringify(info, null, 2); // Pretty print the JSON
    } catch (error) {
      console.error('Error fetching node info:', error);
    }
  }

  async function anvilSetLoggingEnabled(enabled: boolean) {
    await provider.send('anvil_setLoggingEnabled', [enabled]);
  }

  async function evmIncreaseTime(seconds: number) {
    await provider.send('evm_increaseTime', [seconds]);
  }

  async function evmMine() {
    await provider.send('evm_mine', []);
  }

  async function evmSetNextBlockTimestamp(timestamp: number) {
    await provider.send('evm_setNextBlockTimestamp', [timestamp]);
  }

  async function evmSnapshot(): Promise<string> {
    return provider.send('evm_snapshot', []);
  }

  async function evmRevert(snapshotId: string) {
    await provider.send('evm_revert', [snapshotId]);
  }

  async function evmSetAutomine(automine: boolean) {
    await provider.send('evm_setAutomine', [automine]);
  }

  async function evmSetIntervalMining(interval: number) {
    await provider.send('evm_setIntervalMining', [interval]);
  }

  async function anvilSetNonce(address: string, nonce: number) {
    await provider.send('anvil_setNonce', [address, nonce]);
  }

  async function anvilSetBalance(address: string, balance: string) {
    await provider.send('anvil_setBalance', [address, ethers.parseEther(balance)]);
  }

  async function handleSnapshot() {
    snapshotId = await evmSnapshot();
    alert(`Snapshot created with ID: ${snapshotId}`);
  }

  let balanceAddress: string = '';
</script>

<Collapsible label={`Anvil Settings`}>
  <Collapsible label="Node info">
    <pre>{nodeInfo}</pre>
  </Collapsible>

  <Collapsible label="Network settings">
    <div class="input-group">
      <label for="rpcUrl">RPC URL:</label>
      <input id="rpcUrl" type="text" bind:value={rpcUrl} />
    </div>
  </Collapsible>

  <Collapsible label="Mining settings">
    <div class="input-group">
      <label for="miningMode">Mining Mode:</label>
      <select id="miningMode" bind:value={miningMode}>
        <option value="auto">Automatic</option>
        <option value="interval">Interval</option>
        <option value="never">Never (Manual)</option>
      </select>
    </div>
    {#if miningMode === 'interval'}
      <div class="input-group">
        <label for="blockTime">Block Time (s):</label>
        <input id="blockTime" type="number" min="1" bind:value={blockTime} />
      </div>
    {/if}
  </Collapsible>

  <Collapsible label="Account settings">
    <div class="input-group">
      <label for="accountBalance">Default Account Balance (ETH):</label>
      <input id="accountBalance" type="text" bind:value={accountBalance} />
    </div>
    <div class="input-group">
      <label for="autoImpersonate">Auto Impersonate Accounts:</label>
      <input id="autoImpersonate" type="checkbox" bind:checked={autoImpersonate} />
    </div>
  </Collapsible>

  <Collapsible label="Advanced settings">
    <div class="input-group">
      <label for="gasPrice">Gas Price (gwei):</label>
      <input id="gasPrice" type="text" bind:value={gasPrice} />
    </div>
    <div class="input-group">
      <label for="gasLimit">Gas Limit:</label>
      <input id="gasLimit" type="text" bind:value={gasLimit} />
    </div>
    <div class="input-group">
      <label for="chainId">Chain ID:</label>
      <input id="chainId" type="text" bind:value={chainId} />
    </div>
    <div class="input-group">
      <label for="loggingEnabled">Logging Enabled:</label>
      <input id="loggingEnabled" type="checkbox" bind:checked={loggingEnabled} />
    </div>
    <div class="input-group">
      <label for="increaseTimeBySeconds">Increase Time By (seconds):</label>
      <input id="increaseTimeBySeconds" type="number" min="0"
             bind:value={increaseTimeBySeconds} />
    </div>
    <div class="input-group">
      <label for="nextBlockTimestamp">Next Block Timestamp (epoch time):</label>
      <input id="nextBlockTimestamp" type="number" min="0" bind:value={nextBlockTimestamp} />
    </div>
  </Collapsible>

  <Collapsible label="Snapshot settings">
    <button type="button" on:click={handleSnapshot}>Create Snapshot</button>
    <div class="input-group">
      <label for="snapshotId">Snapshot ID:</label>
      <input id="snapshotId" type="text" bind:value={snapshotId} />
      <button type="button" on:click={() => evmRevert(snapshotId)}>Revert to Snapshot</button>
    </div>
  </Collapsible>

  <Collapsible label="Set account balance">
    <div class="input-group">
      <label for="balanceAddress">Address:</label>
      <input id="balanceAddress" type="text" bind:value={balanceAddress} />
      <label for="newBalance">New Balance (ETH):</label>
      <input id="newBalance" type="text" bind:value={accountBalance} />
      <button type="button" on:click={() => anvilSetBalance(balanceAddress, accountBalance)}>Set
        Balance
      </button>
    </div>
  </Collapsible>

  <div class="button-group">
    <button type="button" on:click={applySettings}>Apply Settings</button>
    <button type="button" on:click={evmMine}>Mine a Block</button>
  </div>
</Collapsible>