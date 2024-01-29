import {Graph} from "@circles-sdk-v2/circles-v2-abi-encoder/src/graph";
import Accounts from '../accounts.json';
import Deployments from '../deployments.json';
import {ethers} from "ethers";

const rpcUrl: string = "http://localhost:8545";
const provider = new ethers.JsonRpcProvider(rpcUrl);
const networkId = "10200";

const avatarAccount1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const avatarPrivateKey1 = Accounts[avatarAccount1].privateKey;

const organizationAccount1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const organizationPrivateKey1 = Accounts[organizationAccount1].privateKey;

const groupAccount1 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
const groupPrivateKey1 = Accounts[groupAccount1].privateKey;

const testResultAddresses = {
  avatar: {
    address: "",
    circlesNodeAddress: "",
  },
  circlesNodeAddress: "",
  organizationAddress: "",
  groupAddress: "",
};

describe('Graph', () => {
  it('should register an avatar', async () => {
    const callData = Graph.registerAvatar();
    const wallet = new ethers.Wallet(avatarPrivateKey1, provider);
    const txResponse = await wallet.sendTransaction({
      from: avatarAccount1,
      to: Deployments.Graph[networkId],
      data: callData
    });

    const transactionReceipt = await txResponse.wait();
    expect(transactionReceipt).not.toBeNull();

    const registerAvatarLog = transactionReceipt!.logs
    .filter((log) => log.topics[0] === Graph.eventTopics.RegisterAvatar);
    expect(registerAvatarLog.length).toBe(1);

    const avatarAddress = ethers.stripZerosLeft(registerAvatarLog[0].topics[1]);
    expect(ethers.isAddress(avatarAddress)).toBeTruthy();
    testResultAddresses.avatar.address = avatarAddress;

    const circlesNodeAddress = ethers.stripZerosLeft(registerAvatarLog[0].data);
    expect(ethers.isAddress(circlesNodeAddress)).toBeTruthy();
    testResultAddresses.avatar.circlesNodeAddress = circlesNodeAddress;
  }, 10000);

  it('should register an organization', async () => {
    const callData = Graph.registerOrganization();
    const wallet = new ethers.Wallet(organizationPrivateKey1, provider);
    const txResponse = await wallet.sendTransaction({
      from: organizationAccount1,
      to: Deployments.Graph[networkId],
      data: callData
    });

    const transactionReceipt = await txResponse.wait();
    expect(transactionReceipt).not.toBeNull();

    const registerOrganizationLog = transactionReceipt!.logs
    .filter((log) => log.topics[0] === Graph.eventTopics.RegisterOrganization);
    expect(registerOrganizationLog.length).toBe(1);

    const organizationAddress = ethers.stripZerosLeft(registerOrganizationLog[0].topics[1]);
    expect(ethers.isAddress(organizationAddress)).toBeTruthy();
    testResultAddresses.organizationAddress = organizationAddress;
  }, 10000);

  it('should register a group', async () => {
    // registerGroup
    const callData = Graph.registerGroup("0");
    const wallet = new ethers.Wallet(groupPrivateKey1, provider);
    const txResponse = await wallet.sendTransaction({
      from: groupAccount1,
      to: Deployments.Graph[networkId],
      data: callData
    });

    const transactionReceipt = await txResponse.wait();
    expect(transactionReceipt).not.toBeNull();

    const registerGroupLog = transactionReceipt!.logs
    .filter((log) => log.topics[0] === Graph.eventTopics.RegisterGroup);
    expect(registerGroupLog.length).toBe(1);

    const groupAddress = ethers.stripZerosLeft(registerGroupLog[0].topics[1]);
    expect(ethers.isAddress(groupAddress)).toBeTruthy();
    testResultAddresses.groupAddress = groupAddress;
    expect(registerGroupLog[0].data).toBe("0x0000000000000000000000000000000000000000000000000000000000000000");
  }, 10000);

  it('should allow an organization to trust an avatar', async () => {
    // trust
    const callData = Graph.trust(testResultAddresses.avatar.address);
    const wallet = new ethers.Wallet(organizationPrivateKey1, provider);
    const txResponse = await wallet.sendTransaction({
      from: organizationAccount1,
      to: Deployments.Graph[networkId],
      data: callData
    });

    const transactionReceipt = await txResponse.wait();
    expect(transactionReceipt).not.toBeNull();

    const trustLogs = transactionReceipt!.logs.filter((log) => log.topics[0] === Graph.eventTopics.Trust)
    expect(trustLogs.length).toBe(1);

    const trusterAddress = ethers.stripZerosLeft(trustLogs[0].topics[1]);
    expect(ethers.isAddress(trusterAddress)).toBeTruthy();

    const trusteeAddress = ethers.stripZerosLeft(trustLogs[0].topics[2]);
    expect(ethers.isAddress(trusteeAddress)).toBeTruthy();

    const expiry = trustLogs[0].data;
    console.log("expiry", expiry);
  });
  it('should allow to trust an entity with expiry', async () => {
    // trustWithExpiry
    const callData = Graph.trustWithExpiry('0x0000000000000000000000000000000000000000', BigInt(0));
  });
  it('should allow to untrust an entity', async () => {
    // untrust
    const callData = Graph.untrust('0x0000000000000000000000000000000000000000');
  });

  it('should resolve an avatar by its circle node', async () => {
    // circleToAvatar
    const callData = Graph.circleToAvatar('0x0000000000000000000000000000000000000000');
  });
  it('should resolve a circle node by its avatar', async () => {
    // avatarToCircle
    const callData = Graph.avatarToCircle('0x0000000000000000000000000000000000000000');
  });
  it('should resolve a group circles node by its group', async () => {
    // groupToCircle
    const callData = Graph.groupToCircle('0x0000000000000000000000000000000000000000');
  });
});
