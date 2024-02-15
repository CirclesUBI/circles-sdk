# Circles SDK
The Circles SDK is a library that allows you to interact with the Circles protocol.
It supports version 1 and 2 of the Circles contracts.

*Warning: This library is in a very early development stage. Things are broken and the api surface is pretty much WIP.*

## Build
Currently, there are no npm packages, so you must build the SDK yourself if you want to use it.   
If you want to run a local environment with anvil, see the section *Run locally*.

### Prerequisites
Make sure you have all the following prerequisites properly installed:
* [git](https://git-scm.com/)
* [jq](https://jqlang.github.io/jq/)
* [nodejs](https://nodejs.org/)
* [foundry](https://getfoundry.sh/)

### Clone the repository:
This is a monorepo using npm workspaces.
```bash
git clone https://github.com/CirclesUBI/circles-sdk.git
cd circles-sdk
```

### Build the SDK
```bash
npm install
npm run build
```

## Getting started
### Choose a provider

You can choose between the following providers:
* **EoaEtheresProvider**   
  Use this provider if you want to use a private key to sign transactions.
* **BrowserWalletEthersProvider**  
  Use this provider if you have e.g. metamask installed and want to use it to sign transactions.

```typescript
import { Provider, EoaEtheresProvider, BrowserWalletEthersProvider } from '@circles/circles-sdk-v2-providers';

const wallet = new ethers.Wallet('0x123...'); // Supply your private key
const provider1: Provider = new EoaEtheresProvider('http://localhost:8545', wallet);
await provider1.init();
// or
const provider2: Provider = new BrowserWalletEthersProvider();
await provider2.init();
```
At a later point we will add more providers, e.g. for Safe.

### Configure the Circles SDK
In order to use the sdk you must supply the contracts addresses and a provider:

```typescript
import { Sdk } from '@circles/circles-sdk-v2';

const v1HubAddress = '0x123...';
const v2HubAddress = '0x123...';
const provider = // Choose one of the providers from the previous step

const sdk = new Sdk(v1HubMock, v1HubAddress, v2HubAddress, provider);
```

### Use the Circles SDK
#### Create an avatar
To interact with Circles, you need an avatar. You can create one by calling `createAvatar`.  
The address can be any address (EOA, smart contract wallet) that you control.

```typescript
const avatar = await sdk.createAvatar("0x123..."); // Supply the avatar address
await avatar.init();
```
Depending on your previous usage of the address, the avatar will be initialized in one of these states:
```typescript
enum AvatarState {
  Unregistered,                 // The address has not been used with Circles before
  V1_Human,                     // The address is only a V1 human
  V1_StoppedHuman,              // The address is only a V1 human that has been stopped
  V1_Organization,              // The address is only a V1 organization
  V2_Human,                     // The address is only a V2 human
  V2_Group,                     // The address is only a V2 group
  V2_Organization,              // The address is only a V2 organizations
  V1_StoppedHuman_and_V2_Human, // The address is a V1 human that has been stopped and a V2 human
  Unknown                       // The address has been used with Circles before, but the state is unknown
}
```

#### Use an existing Circles account
If you already have a v1 Circles account, you can upgrade it to v2.

After upgrading,  
* ... you will have a new personal v2 token that you can use to mint.  
* ... you can convert all your v1 token holdings to v2 tokens as long as they're available on v2 already.  

If your friends haven't upgraded to v2 yet, you can 'invite' them. This will cost you a fee, but everyone will be able to convert v1 tokens of the invited person to v2 tokens immediately (See *'Invite a friend'* below).

Note: *If these prerequisites aren't met, you must be invited by an existing member instead.*

##### 1) Prerequisites:  
* The registration period is not over
* Your v1 token must be stopped
```typescript
// Check if the registration period is already over
if (await sdk.isRegistrationPeriodOver()) {
  throw new Error('The registration period is already over');
}

// Check if the avatar is a V1 human and has been stopped
if (avatar.state !== AvatarState.V1_StoppedHuman) {
  throw new Error('You cannot register at Circles v2 because your v1 token is not stopped');
}
```
If you're v1 token is not stopped, you can stop it like this:
```typescript
if (avatar.state !== AvatarState.V1_Human) {
  throw new Error(`You don't have a v1 token`);
}
const txReceipt = await avatar.stopV1();
```

##### 2) Register at Circles v2:  
In Circles v2, every human has a profile. The profile is a JSON object that is stored on IPFS.
The profile is identified by a CIDv0 (Content Identifier). The CID is updatable for the case that the profile changes in the future.    

The profile schema is defined in [ERC-1155 Metadata URI JSON Schema](https://eips.ethereum.org/EIPS/eip-1155#erc-1155-metadata-uri-json-schema). 
```typescript
const cidV0 = 'Qm...'; // CIDv0 of your profile
const txReceipt = await avatar.registerHuman(cidV0);
```
##### 3) Verify:
If the registration was successful, the state of your avatar should have changed to `V1_StoppedHuman_and_V2_Human`.
```typescript
if (avatar.state !== AvatarState.V1_StoppedHuman_and_V2_Human) {
  throw new Error('Something went wrong');
}
```

#### Invite a friend
If you are already a member of Circles, you can invite a friend to join.  
After the end of the registration period, this is the only way for new people to register at Circles.

The friend is identified by their address. The address can be any address (EOA, smart contract wallet) that your friend controls.

You can invite someone in order to:
* ... allow them to join Circles for the first time
* ... allow them to upgrade their existing accounts
* ... convert v1 token holdings to v2 tokens if the person hasn't upgraded yet

After inviting,
* ... the invited person will have a new personal v2 token.
* ... you (and others) can convert v1 token holdings of the invitee's token to v2 tokens.

Note: *The inviter must pay an invitation fee. The invitee will get a welcome bonus.*

##### 1) Prerequisites:
```typescript
// Mint the outstanding amount of personal tokens to maximize the chances of being able to invite someone.
await avatar.mintPersonalTokens();

// How high is the invitation fee?
const invitationFee: bigint = await sdk.getInvitationFee();

// Whats the balance of the avatar's own token?
const ownTokenBalance: bigint = await avatar.getTokenBalance();

// Can be paid?
if (invitationFee > ownTokenBalance) {
  throw new Error('You must mint more personal tokens before you can invite someone.');
}
```

##### 2) Send the invitation:
```typescript
const txReceipt = await avatar.inviteHuman('0x123...');
```

##### 3) Verify:
If the invitation was successful, the state of the invited avatar should have changed to `V2_Human`.
```typescript
const invitedAvatar = await sdk.createAvatar('0x123...');
await invitedAvatar.init();

if (invitedAvatar.state !== AvatarState.V2_Human) {
  throw new Error('Something went wrong');
}
```

#### Update your profile
In Circles v2, every human has a profile. The profile is a JSON object that is stored on IPFS.
The profile is identified by a CIDv0 (Content Identifier). The CID is updatable for the case that the profile changes in the future.

The profile schema is defined in [ERC-1155 Metadata URI JSON Schema](https://eips.ethereum.org/EIPS/eip-1155#erc-1155-metadata-uri-json-schema).

Use this method, if
* ... you want to update your profile.
* ... you have been invited and don't have a profile yet.

```typescript
const cidV0 = 'Qm...'; // New CIDv0 of your profile
const txReceipt = await avatar.updateProfile(cidV0);
```

## Run locally
For testing and development purposes, it makes sense to run a local environment with anvil.

### Prerequisites
* build the SDK as described in the previous section.

### Run anvil
```bash
anvil --port 8545 --gas-limit 8000000 --accounts 10
```
When [anvil](https://book.getfoundry.sh/reference/anvil/) was started with default values, you can use the following values to connect to:
* URL: http://localhost:8545
* Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
* Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

If you need more accounts, see anvil's console output.

### Deploy the contracts
The SDK comes with a script that deploys all relevant contracts with `forge create`.
The `deployContracts.sh` script can be configured with environment variables or an `.env` file.

Create custom .env files if you want to deploy to other targets. For a local deployment, you can use `.env.anvil`:
```bash
./deployContracts.sh .env.anvil
```

After the deployment, the script will print the addresses of the deployed contracts.
```
Summary:
========
V1 Hub: 0x5FbDB2315678afecb367f032d93F642f64180aa3
V2 Hub: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### Configure the Circles SDK
You can use the following code to configure the Circles SDK so that it uses the local anvil environment.
Here we're using the values from above:
```typescript
import { Sdk } from '@circles/circles-sdk-v2';

const rpcUrl = 'http://localhost:8545';
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const v1HubAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const v2HubAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl, wallet);
const wallet = new ethers.Wallet(privateKey, jsonRpcProvider);

const provider = new EoaEtheresProvider(jsonRpcProvider, wallet);
await provider.init();

const sdk = new Sdk(v1HubAddress, v2HubAddress, provider);
const avatar = await sdk.createAvatar(wallet.address);
await avatar.init();

console.log(`Avatar ${avatar.address} state:`, avatar.state);
```

### Run tests
To run the 'jest' tests, use the following command in the repository root directory:
```bash
npm run test
```