describe('Buildings', () => {
  let Buildings;

  beforeEach(() => {
    module('munchkins');

    inject(($injector) => {
      Buildings = $injector.get('Buildings');
    });
  });

  testStructure('Buildings', TYPES_BUILDINGS);

  describe('.all', () => {
    it('returns all resources', () => {
      const all = Buildings.all();
      expect(all).to.be.ok;
      expect(Object.keys(all).length).to.be.at.least(1);
    });
  });

  describe('.get', () => {
    it('returns a specific resource', () => {
      const item = Buildings.get('shelter');
      expect(item).to.be.ok;
    });
  });

  describe('.save', () => {
    it('saves values', () => {
      const item = Buildings.get('shelter');
      item.locked = 'locked';
      item.value = 1234;

      const save = {};
      Buildings.save(save);

      expect(save.shelter.locked).to.equal('locked');
      expect(save.shelter.value).to.equal(1234);
    });
  });

  describe('.load', () => {
    it('loads values', () => {
      const item = Buildings.get('shelter');

      const load = { shelter: { locked: 'locked', value: 1234 }};
      Buildings.load(load);

      expect(item.locked).to.equal('locked');
      expect(item.value).to.equal(1234);
    });

    it('ignores unknowns', () => {
      const load = { unknown: { locked: 'locked', value: 1234 }};
      Buildings.load(load);
    });
  });

  describe('.activeTotal', () => {
    it('has no unlocks at the start', () => {
      expect(Buildings.activeTotal()).to.equal(0);
    });

    it('returns the collect unlocks', () => {
      Buildings.get('shelter').locked = false;
      Buildings.get('fire').locked = false;

      expect(Buildings.activeTotal()).to.equal(2);
    });
  });
});
