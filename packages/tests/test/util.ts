import accounts from "./accounts.json";
import {ethers} from "ethers";
import HUB_V1 from "../circles-contracts-v1/out/Hub.sol/Hub.json";
import CRC_V1 from "../circles-contracts-v1/out/Token.sol/Token.json";
import HUB_V2 from "../circles-contracts-v2/out/Hub.sol/Hub.json";
import multihashes from "multihashes";

export const V1_HUB_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const V2_HUB_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const JSON_RPC_URL = "http://localhost:8545";

export type Unregistered = "unregistered";
export type V1Avatar = "v1Person" | "v1Organization";
export type HumanAvatar = "registeredHuman" | "invitedActiveHuman" | "invitedInactiveHuman";
export type OrganizationAvatar = "registeredOrganization";
export type GroupAvatar = "registeredGroup" | "registeredCustomGroup";
export type AvatarType = Unregistered | V1Avatar | HumanAvatar | OrganizationAvatar | GroupAvatar;

export type Avatar = {
  type: AvatarType;
  address: string;
  key: string;
  wallet: ethers.Wallet
};

/**
 * Returns a fresh unregistered avatar.
 * The index can be used to address a specific unregistered avatar.
 */
export const getUnregisteredAvatar = async (): Promise<Avatar> => {
  const key = accounts[lastUnregisteredAvatarIdx];
  lastUnregisteredAvatarIdx++;

  const provider = await getJsonRpcProvider();
  const wallet = new ethers.Wallet(key, provider);
  return {
    type: "unregistered",
    address: wallet.address,
    key: wallet.privateKey,
    wallet: wallet
  };
};
let lastUnregisteredAvatarIdx = 0;

export type V1PersonAvatar = Avatar & {
  type: "v1Person";
  v1TokenAddress: string;
};

export const getActiveV1PersonAvatar = async (): Promise<V1PersonAvatar> => {
  const unregistered = await getUnregisteredAvatar();
  const hubContract = new ethers.Contract(V1_HUB_ADDRESS, HUB_V1.abi, unregistered.wallet);
  const tx = await hubContract.signup();
  await tx.wait();
  const v1TokenAddress = await hubContract.userToToken(unregistered.address);

  return {
    ...unregistered,
    type: "v1Person",
    v1TokenAddress: v1TokenAddress
  };
}

export const getStoppedV1PersonAvatar = async (): Promise<V1PersonAvatar> => {
  const activeV1PersonAvatar = await getActiveV1PersonAvatar();
  const tokenContract = new ethers.Contract(activeV1PersonAvatar.v1TokenAddress, CRC_V1.abi, activeV1PersonAvatar.wallet);
  const tx = await tokenContract.stop();
  await tx.wait();

  return {
    ...activeV1PersonAvatar
  };
}

export type RegisteredHuman = Avatar & {
  type: "registeredHuman";
};
export const registerHuman = async (unregisteredAvatar: Avatar): Promise<RegisteredHuman> => {
  const hubV2Contract = new ethers.Contract(V2_HUB_ADDRESS, HUB_V2.abi, unregisteredAvatar.wallet);
  // TODO: Get the CID from somewhere
  const cidV0 = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  const decodedMultihash = multihashes.fromB58String(cidV0);
  const hashBytes32 = decodedMultihash.slice(-32);
  const tx = await hubV2Contract.registerHuman(hashBytes32);
  await tx.wait();
  return {
    ...unregisteredAvatar,
    type: "registeredHuman",
  };
};

export type RegisteredOrganization = Avatar & {
  type: "registeredOrganization";
};
export const registerOrganization = async (unregisteredAvatar: Avatar): Promise<RegisteredOrganization> => {
  const hubV2Contract = new ethers.Contract(V2_HUB_ADDRESS, HUB_V2.abi, unregisteredAvatar.wallet);
  // TODO: Get the CID from somewhere
  const cidV0 = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  const decodedMultihash = multihashes.fromB58String(cidV0);
  const hashBytes32 = decodedMultihash.slice(-32);
  const tx = await hubV2Contract.registerOrganization("test org", hashBytes32);
  await tx.wait();
  return {
    ...unregisteredAvatar,
    type: "registeredOrganization",
  };
};

export type RegisteredGroup = Avatar & {
  type: "registeredGroup"
};
export const registerGroup = async (unregisteredAvatar: Avatar): Promise<RegisteredGroup> => {
  const hubV2Contract = new ethers.Contract(V2_HUB_ADDRESS, HUB_V2.abi, unregisteredAvatar.wallet);
  // TODO: Get the CID from somewhere
  const cidV0 = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  const decodedMultihash = multihashes.fromB58String(cidV0);
  const mintPolicy = "0x";
  const name = "test group";
  const symbol = "TST";
  const cidBytes = decodedMultihash.slice(-32);
  const tx = await hubV2Contract.registerGroup(mintPolicy, name, symbol, cidBytes);
  await tx.wait();
  return {
    ...unregisteredAvatar,
    type: "registeredGroup",
  };
};

export type RegisteredCustomGroup = Avatar & {
  type: "registeredCustomGroup";
};
export const registerCustomGroup = async (unregisteredAvatar: Avatar, treasuryAddress:string): Promise<RegisteredCustomGroup> => {
  throw new Error("Not implemented");
};

export const getJsonRpcProvider = async (): Promise<ethers.JsonRpcProvider> => {
  return new ethers.JsonRpcProvider(JSON_RPC_URL);
};
