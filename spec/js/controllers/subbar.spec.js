describe('Subbar Controller', () => {
  let Ctrl;

  beforeEach(() => {
    module('munchkins');

    inject(($controller) => {
      Ctrl = $controller('Subbar');
    });
  });

  describe('init', () => {
    it('exists', () => {
      expect(Ctrl).to.be.ok;
    });
  });
});
