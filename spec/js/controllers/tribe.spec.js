describe('Tribe Controller', () => {
  let Ctrl;

  beforeEach(() => {
    module('munchkins');

    inject(($controller) => {
      Ctrl = $controller('Tribe');
    });
  });

  describe('init', () => {
    it('exists', () => {
      expect(Ctrl).to.be.ok;
    });
  });
});
