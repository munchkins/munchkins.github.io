describe('Tribe', () => {
  let Tribe;

  beforeEach(() => {
    module('munchkins');

    inject(($injector) => {
      Tribe = $injector.get('Tribe');
    });
  });

  testStructure('Tribe', TYPES_TRIBE);

  describe('.all', () => {
    it('returns all resources', () => {
      const all = Tribe.all();
      expect(all).to.be.ok;
      expect(Object.keys(all).length).to.be.at.least(1);
    });
  });

  describe('.get', () => {
    it('returns a specific resource', () => {
      const item = Tribe.get('farmer');
      expect(item).to.be.ok;
    });
  });

  describe('.add, .free, .total & .allocated', () => {
    it('starts with 0 free', () => {
      expect(Tribe.free()).to.equal(0);
    });

    it('starts with 0 total', () => {
      expect(Tribe.total()).to.equal(0);
    });

    it('adds free on .add', () => {
      Tribe.add(5);
      expect(Tribe.free()).to.equal(5);
    });

    it('adds total on .add', () => {
      Tribe.add(5);
      expect(Tribe.total()).to.equal(5);
    });

    it('adds total on active', () => {
      Tribe.get('farmer').value.current = 5;
      expect(Tribe.total()).to.equal(5);
    });

    it('reflects the allocated amount', () => {
      Tribe.add(5);
      Tribe.get('farmer').value.current = 2;
      expect(Tribe.allocated()).to.equal(2);
    });
  });

  describe('.save', () => {
    it('save free', () => {
      Tribe.add(5);

      const save = {};
      Tribe.save(save);

      expect(save.free).to.equal(5);
    });

    it('saves types', () => {
      const item = Tribe.get('farmer');
      item.locked = 'locked';
      item.value = 1234;

      const save = {};
      Tribe.save(save);

      expect(save.types.farmer.locked).to.equal('locked');
      expect(save.types.farmer.value).to.equal(1234);
    });
  });

  describe('.load', () => {
    it('loads free', () => {
      const load = { free: 5 };
      Tribe.load(load);

      expect(Tribe.free()).to.equal(5);
    });

    it('loads types', () => {
      const item = Tribe.get('farmer');

      const load = { types: { farmer: { locked: 'locked', value: 1234 }}};
      Tribe.load(load);

      expect(item.locked).to.equal('locked');
      expect(item.value).to.equal(1234);
    });

    it('ignores unknowns', () => {
      const load = { types: { unknown: { locked: 'locked', value: 1234 }}};
      Tribe.load(load);
    });
  });
});
