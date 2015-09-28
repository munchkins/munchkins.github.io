describe('Subbar Controller', () => {
  let Ctrl;
  let location;

  beforeEach(() => {
    module('munchkins');

    inject(($controller, $location) => {
      Ctrl = $controller('Subbar');
      location = $location;
    });
  });

  describe('init', () => {
    it('exists', () => {
      expect(Ctrl).to.be.ok;
    });
  });

  describe('isOn', () => {
    it('returns false when path does not match', () => {
      expect(Ctrl.isOn('/test')).to.be.false;
    });

    it('returns true when path does match', () => {
      location.path('/test');
      expect(Ctrl.isOn('/test')).to.be.true;
    });
  });
});
