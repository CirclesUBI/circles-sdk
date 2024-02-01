describe('Hub', () => {
  describe('registerHuman', () => {
    it('should register a human', async () => {});
    it('should revert when trying to register the same human again', async () => {});

    describe('registered humans', () => {
      it('should have an associated token with their avatar-address as token-id', async () => {});
    });
  });

  describe('registerOrganization', () => {
    it('should register an organization', async () => {});
    it('should revert when trying to register the same organization again', async () => {});
  });

  describe('registerGroup', () => {
    it('should register a group', async () => {});
    it('should revert when trying to register the same group again', async () => {});
  });

  describe('trust', () => {
    it('can be established from organization to human', async () => {});
    it('can be established from human to human', async () => {});
    it('can be established from group to human', async () => {});
    it('can be established from human to organization', async () => {});
    it('can be established from any avatar to arbitrary addresses', async () => {});

    describe("established trust", () => {
      it('can expire', async () => {});
      it('can be revoked', () => {});
    });
  });
});
