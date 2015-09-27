describe('Buildings Controller', () => {
  let Ctrl;

  beforeEach(() => {
    module('munchkins');

    inject(($controller) => {
      Ctrl = $controller('Buildings');
    });
  });

  describe('init', () => {
    it('exists', () => {
      expect(Ctrl).to.be.ok;
    });
  });
});
