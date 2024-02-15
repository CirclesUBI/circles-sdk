export const v1HubMock = {
  organizations: jest.fn(),
  userToToken: jest.fn(),
  getToken: jest.fn((address: string) => ({
    stopped: jest.fn()
  }))
};