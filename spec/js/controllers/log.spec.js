describe('Log Controller', () => {
  let Ctrl;

  beforeEach(() => {
    module('munchkins');

    inject(($controller) => {
      Ctrl = $controller('Log');
    });
  });

  describe('init', () => {
    it('exists', () => {
      expect(Ctrl).to.be.ok;
    });
  });
});
