describe('Actions', () => {
  let Actions;

  let buildingsMock;
  let craftingMock;
  let resourcesMock;
  let tribeMock;

  beforeEach(() => {
    module('munchkins');

    module(($provide) => {
      buildingsMock = {
        all: function() {
          return {
            building1: {
              value: { current: 1 },
              provides: {
                resources: { resource1: { rate: 0.5 } }
              },
              requires: {
                resources: { resource2: { rate: 0.1 } }
              }
            },
            building2: {
              value: { current: 0 },
              requires: {
                buildings: { building1: { value: 2 }}
              },
              provides: { resources: {} }
            }
          };
        }
      };
      sinon.spy(buildingsMock, 'all');
      $provide.service('Buildings', function() {
        this.all = buildingsMock.all;
      });

      craftingMock = {
        all: function() {
          return {};
        }
      };
      sinon.spy(craftingMock, 'all');
      $provide.service('Crafting', function() {
        this.all = craftingMock.all;
      });

      const resources = {
        resource1: { rate: 0 },
        resource2: { rate: 0 },
        resource3: { rate: 0 }
      };
      resourcesMock = {
        all: function() {
          return resources;
        }
      };
      sinon.spy(resourcesMock, 'all');
      $provide.service('Resources', function() {
        this.all = resourcesMock.all;
        this.get = function(k) {
          return this.all()[k];
        };
      });

      tribeMock = {
        free: function() {
          return 1;
        },
        all: function() {
          return {
            tribe1: {
              value: { current: 1 },
              requires: { resources: {} },
              provides: {
                resources: {
                  resource3: { rate: 0.33 }
                }
              }
            }
          };
        }
      };
      sinon.spy(tribeMock, 'all');
      sinon.spy(tribeMock, 'free');
      $provide.service('Tribe', function() {
        this.all = tribeMock.all;
        this.free = tribeMock.free;
      });
    });

    inject(($injector) => {
      Actions = $injector.get('Actions');
      sinon.spy(Actions, 'initResource');
    });
  });

  afterEach(() => {
    Actions.initResource.restore();
  });

  describe('.initResources & .initResource', () => {
    it('initialises Buildings & Tribe', () => {
      Actions.initResources();

      expect(buildingsMock.all).to.have.been.called;
      expect(tribeMock.all).to.have.been.called;

      const resources = resourcesMock.all();
      expect(resources.resource1.rate).to.equal(0.5);
      expect(resources.resource2.rate).to.equal(-0.1);
      expect(resources.resource3.rate).to.equal(0.33);
    });
  });

  describe('.priceMultiplier', () => {
    it('converts the initial value', () => {
      const item = { increase: 1.5, value: { current: 1 }};
      const incr = Actions.priceMultiplier(item);
      expect(incr).to.equal(1.5);
    });

    it('coverts the 2nd value', () => {
      const item = { increase: 1.5, value: { current: 2 }};
      const incr = Actions.priceMultiplier(item);
      expect(incr).to.equal(1.5 * 1.5);
    });
  });

  describe('.isBuyable', () => {
    it('passes simple items', () => {
      const item = { increase: 1, value: { current: 1 }, requires: { resources: {} } };
      expect(Actions.isBuyable(item)).to.be.true;
    });

    it('ignores locked items', () => {
      const item = { increase: 1, value: { current: 1 }, requires: { resources: {} }, locked: true };
      expect(Actions.isBuyable(item)).to.be.false;
    });

    describe('tribe resources', () => {
      it('passes when enough free', () => {
        const item = { increase: 1, value: { current: 1 }, requires: { resources: {}, tribe: 1 } };
        expect(Actions.isBuyable(item)).to.be.true;
        expect(tribeMock.free).to.have.been.called;
      });

      it('fails when not enough free', () => {
        const item = { increase: 1, value: { current: 1 }, requires: { resources: {}, tribe: 2 } };
        expect(Actions.isBuyable(item)).to.be.false;
        expect(tribeMock.free).to.have.been.called;
      });
    });

    describe('resources checking', () => {
      let resource;

      beforeEach(() => {
        const resources = resourcesMock.all();

        resource = resources.resource1;
        resource.value = { current: 5 };

        resources.resource2.value = { current: 10 };
      });

      describe('with singles', () => {
        it('passes on smaller required amounts', () => {
          const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 4 } } } };
          expect(Actions.isBuyable(item)).to.be.true;
        });

        it('passes on exact required amounts', () => {
          const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 5 } } } };
          expect(Actions.isBuyable(item)).to.be.true;
        });

        it('fails on larger required amounts', () => {
          const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 6 } } } };
          expect(Actions.isBuyable(item)).to.be.false;
        });
      });

      describe('with multiples', () => {
        it('passes on exact required amounts', () => {
          const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 5 }, resource2: { value: 4 } } } };
          expect(Actions.isBuyable(item)).to.be.true;
        });

        it('fails on larger required amounts', () => {
          const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 5 }, resource2: { value: 11 } } } };
          expect(Actions.isBuyable(item)).to.be.false;
        });
      });

      describe('price increments', () => {
        it('is taken into account', () => {
          const item = { increase: 1.1, value: { current: 2 }, requires: { resources: { resource1: { value: 5 } } } };
          expect(Actions.isBuyable(item)).to.be.false;
        });
      });
    });
  });
});
