describe('Resources', () => {
  let Resources;

  beforeEach(() => {
    module('munchkins');

    inject(($injector) => {
      Resources = $injector.get('Resources');
    });
  });

  describe('.all', () => {
    it('returns all resources', () => {
      const all = Resources.all();
      expect(all).to.be.ok;
      expect(Object.keys(all).length).to.be.at.least(1);
    });
  });

  describe('.get', () => {
    it('returns a specific resource', () => {
      const item = Resources.get('flowers');
      expect(item).to.be.ok;
    });
  });

  describe('.save', () => {
    it('saves values', () => {
      const item = Resources.get('flowers');
      item.value = 1234;

      const save = {};
      Resources.save(save);

      expect(save.flowers.value).to.equal(1234);
    });
  });

  describe('.load', () => {
    it('loads values', () => {
      const item = Resources.get('flowers');

      const load = { flowers: { value: 1234 }};
      Resources.load(load);

      expect(item.value).to.equal(1234);
    });

    it('ignores unknowns', () => {
      const load = { unknown: { value: 1234 }};
      Resources.load(load);
    });
  });
});
