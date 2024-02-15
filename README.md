# Circles SDK v2
The Circles SDK is a library that allows you to interact with the Circles UBI protocol.
It supports version 1 and 2 of the Circles contracts.

## Build
Currently, there are no npm packages, so you must build the SDK yourself if you want to use it.

### Prerequisites
* [git](https://git-scm.com/)
* [jq](https://jqlang.github.io/jq/)
* [Node.js](https://nodejs.org/)
* [foundry](https://getfoundry.sh/)

### Clone the repository:
This is a monorepo using npm workspaces.
It references the [v1](https://github.com/CirclesUBI/circles-contracts) as well as the [v2](https://github.com/CirclesUBI/circles-contracts-v2) contracts as submodules
and thus must be cloned with the `--recurse-submodules` flag.
```bash
git clone --recurse-submodules https://github.com/CirclesUBI/circles-sdk.git
cd circles-sdk
```

### Build the SDK
```bash
npm install
npm run build
```

## Getting started
### Choose and initialize a provider

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
The address can be any address (EOA, smart contrabuiltin ct wallet) that you control.

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

#### Get the avatar's state