describe('Crafting', () => {
  let Crafting;

  beforeEach(() => {
    module('munchkins');

    inject(($injector) => {
      Crafting = $injector.get('Crafting');
    });
  });

  testStructure('Crafting', TYPES_CRAFTING);

  describe('.all', () => {
    it('returns all resources', () => {
      const all = Crafting.all();
      expect(all).to.be.ok;
      expect(Object.keys(all).length).to.be.at.least(1);
    });
  });

  describe('.get', () => {
    it('returns a specific resource', () => {
      const item = Crafting.get('collect');
      expect(item).to.be.ok;
    });
  });

  describe('.save', () => {
    it('saves values', () => {
      const item = Crafting.get('collect');
      item.locked = 'locked';
      item.value = 1234;

      const save = {};
      Crafting.save(save);

      expect(save.collect.locked).to.equal('locked');
      expect(save.collect.value).to.equal(1234);
    });
  });

  describe('.load', () => {
    it('loads values', () => {
      const item = Crafting.get('collect');

      const load = { collect: { locked: 'locked', value: 1234 }};
      Crafting.load(load);

      expect(item.locked).to.equal('locked');
      expect(item.value).to.equal(1234);
    });

    it('ignores unknowns', () => {
      const load = { unknown: { locked: 'locked', value: 1234 }};
      Crafting.load(load);
    });
  });
});
