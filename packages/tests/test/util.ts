import accounts from "./accounts.json";
import {ethers} from "ethers";

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
};

/**
 * Returns a fresh unregistered avatar.
 * The index can be used to address a specific unregistered avatar.
 */
export const getUnregisteredAvatar = async (): Promise<Avatar> => {
  const key = accounts[lastUnregisteredAvatarIdx];
  lastUnregisteredAvatarIdx++;

  const address = await ethers.Wallet.createRandom().getAddress();
  return {
    type: "unregistered",
    address,
    key
  };
};
let lastUnregisteredAvatarIdx = 0;

export type V1PersonAvatar = Avatar & {
  type: "v1Person";
  v1TokenAddress: string;
};
/**
 * TODO: Returns a fresh avatar with an active v1 token.
 */
export const getActiveV1PersonAvatar = async (): Promise<V1PersonAvatar> => {
  throw new Error("Not implemented");
}

/**
 * TODO: Returns a fresh avatar with an inactive v1 token.
 */
export const getStoppedV1PersonAvatar = async (): Promise<V1PersonAvatar> => {
  throw new Error("Not implemented");
}

export type RegisteredHuman = Avatar & {
  type: "registeredHuman";
};
export const registerHuman = async (unregisteredAvatar: Avatar): Promise<RegisteredHuman> => {
  return {
    type: "registeredHuman",
    address: unregisteredAvatar.address,
    key: unregisteredAvatar.key
  };
};

export type RegisteredOrganization = Avatar & {
  type: "registeredOrganization";
};
export const registerOrganization = async (unregisteredAvatar: Avatar): Promise<RegisteredOrganization> => {
  throw new Error("Not implemented");
};

export type RegisteredGroup = Avatar & {
  type: "registeredGroup"
};
export const registerGroup = async (unregisteredAvatar: Avatar): Promise<RegisteredGroup> => {
  throw new Error("Not implemented");
};

export type RegisteredCustomGroup = Avatar & {
  type: "registeredCustomGroup";
};
export const registerCustomGroup = async (unregisteredAvatar: Avatar, treasuryAddress:string): Promise<RegisteredCustomGroup> => {
  throw new Error("Not implemented");
};

export const getJsonRpcProvider = async (): Promise<ethers.JsonRpcProvider> => {
  throw new Error("Not implemented");
};
