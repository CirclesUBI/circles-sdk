import Accounts from '../accounts.json';
import Deployments from '../deployments.json';
import {ethers, ZeroAddress} from "ethers";
import {Hub} from "@circles-sdk-v2/circles-v2-abi-encoder/dist/hub";

const rpcUrl: string = "http://localhost:8545";
const provider = new ethers.JsonRpcProvider(rpcUrl);
const networkId = "10200";

const humanAccount1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const avatarPrivateKey1 = Accounts[humanAccount1].privateKey;

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

describe('Hub', () => {
  describe('registerHuman', () => {
    it('should register a human', async () => {
      const callData = Hub.registerHuman();
      const wallet = new ethers.Wallet(avatarPrivateKey1, provider);
      const txResponse = await wallet.sendTransaction({
        from: humanAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      const transactionReceipt = await txResponse.wait();
      expect(transactionReceipt).not.toBeNull();

      const registerAvatarLog = transactionReceipt!.logs
      .filter((log) => log.topics[0] === Hub.eventTopics.RegisterHuman);
      expect(registerAvatarLog.length).toBe(1);

      const avatarAddress = ethers.stripZerosLeft(registerAvatarLog[0].topics[1]);
      expect(ethers.isAddress(avatarAddress)).toBeTruthy();
      testResultAddresses.avatar.address = avatarAddress;

      const circlesNodeAddress = ethers.stripZerosLeft(registerAvatarLog[0].data);
      expect(ethers.isAddress(circlesNodeAddress)).toBeTruthy();
      testResultAddresses.avatar.circlesNodeAddress = circlesNodeAddress;
    }, 10000);

    it('should revert when trying to register the same human again', async () => {
      const callData = Hub.registerHuman();
      const wallet = new ethers.Wallet(avatarPrivateKey1, provider);

      // expect the transaction to be reverted
      const txResponse = await wallet.sendTransaction({
        from: humanAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      await expect(txResponse.wait()).rejects.toThrow();
    });
  });

  describe('registerOrganization', () => {
    it('should register an organization', async () => {
      const callData = Hub.registerOrganization("test-org");
      const wallet = new ethers.Wallet(organizationPrivateKey1, provider);
      const txResponse = await wallet.sendTransaction({
        from: organizationAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      const transactionReceipt = await txResponse.wait();
      expect(transactionReceipt).not.toBeNull();

      const registerOrganizationLog = transactionReceipt!.logs
      .filter((log) => log.topics[0] === Hub.eventTopics.RegisterOrganization);
      expect(registerOrganizationLog.length).toBe(1);

      const organizationAddress = ethers.stripZerosLeft(registerOrganizationLog[0].topics[1]);
      expect(ethers.isAddress(organizationAddress)).toBeTruthy();
      testResultAddresses.organizationAddress = organizationAddress;
    }, 10000);

    it('should revert when trying to register the same organization again', async () => {
      const callData = Hub.registerOrganization("test-org");
      const wallet = new ethers.Wallet(organizationPrivateKey1, provider);

      // expect the transaction to be reverted
      const txResponse = await wallet.sendTransaction({
        from: organizationAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      await expect(txResponse.wait()).rejects.toThrow();
    });
  });

  describe('registerGroup', () => {
    it('should register a group', async () => {
      // registerGroup
      const callData = Hub.registerGroup(ZeroAddress, "test-group", "GRP");
      const wallet = new ethers.Wallet(groupPrivateKey1, provider);
      const txResponse = await wallet.sendTransaction({
        from: groupAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      const transactionReceipt = await txResponse.wait();
      expect(transactionReceipt).not.toBeNull();

      const registerGroupLog = transactionReceipt!.logs
      .filter((log) => log.topics[0] === Hub.eventTopics.RegisterGroup);
      expect(registerGroupLog.length).toBe(1);

      const groupAddress = ethers.stripZerosLeft(registerGroupLog[0].topics[1]);
      expect(ethers.isAddress(groupAddress)).toBeTruthy();
      testResultAddresses.groupAddress = groupAddress;
      expect(registerGroupLog[0].data).toBe("0x0000000000000000000000000000000000000000000000000000000000000000");
    }, 10000);

    it('should revert when trying to register the same group again', async () => {
      const callData = Hub.registerGroup(ZeroAddress, "test-group", "GRP");
      const wallet = new ethers.Wallet(groupPrivateKey1, provider);

      // expect the transaction to be reverted
      const txResponse = await wallet.sendTransaction({
        from: groupAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      await expect(txResponse.wait()).rejects.toThrow();
    });
  });

  describe('trust', () => {
    it('can be established from organization to human', async () => {
      // trust
      const callData = Hub.trust(testResultAddresses.avatar.address, "0");
      const wallet = new ethers.Wallet(organizationPrivateKey1, provider);
      const txResponse = await wallet.sendTransaction({
        from: organizationAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      const transactionReceipt = await txResponse.wait();
      expect(transactionReceipt).not.toBeNull();

      const trustLogs = transactionReceipt!.logs.filter((log) => log.topics[0] === Hub.eventTopics.Trust)
      expect(trustLogs.length).toBe(1);

      const trusterAddress = ethers.stripZerosLeft(trustLogs[0].topics[1]);
      expect(ethers.isAddress(trusterAddress)).toBeTruthy();

      const trusteeAddress = ethers.stripZerosLeft(trustLogs[0].topics[2]);
      expect(ethers.isAddress(trusteeAddress)).toBeTruthy();

      const expiry = trustLogs[0].data;
      console.log("expiry", expiry);
    });

    it('can be established from human to human', async () => {
    });

    it('can be established from group to human', async () => {
    });

    it('can be established from human to organization', async () => {
    });

    it('can be established from human to arbitrary addresses', async () => {
      const randomAddress = ethers.Wallet.createRandom().address;
      const callData = Hub.trust(randomAddress, "0");
      const wallet = new ethers.Wallet(humanAccount1, provider);
      const txResponse = await wallet.sendTransaction({
        from: organizationAccount1,
        to: Deployments.Hub[networkId],
        data: callData
      });

      const transactionReceipt = await txResponse.wait();
      expect(transactionReceipt).not.toBeNull();

      const trustLogs = transactionReceipt!.logs.filter((log) => log.topics[0] === Hub.eventTopics.Trust)
      expect(trustLogs.length).toBe(1);

      const trusterAddress = ethers.stripZerosLeft(trustLogs[0].topics[1]);
      expect(ethers.isAddress(trusterAddress)).toBeTruthy();

      const trusteeAddress = ethers.stripZerosLeft(trustLogs[0].topics[2]);
      expect(ethers.isAddress(trusteeAddress)).toBeTruthy();

      const expiry = trustLogs[0].data;
      console.log("expiry", expiry);
    });
  });
});
