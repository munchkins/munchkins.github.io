describe('Game Controller', () => {
  let Ctrl;

  beforeEach(() => {
    module('munchkins');

    inject(($controller) => {
      Ctrl = $controller('Game');
    });
  });

  describe('init', () => {
    it('exists', () => {
      expect(Ctrl).to.be.ok;
    });
  });
});
