describe('Actions', () => {
  let Actions;

  let buildingsMock;
  let craftingMock;
  let resourcesMock;
  let tribeMock;

  beforeEach(() => {
    module('munchkins');

    module(($provide) => {
      const buildings = {
        building1: {
          value: { current: 1 },
          provides: { resources: { resource1: { rate: 0.5 } } },
          requires: { resources: { resource2: { rate: 0.1 } } }
        },
        building2: {
          value: { current: 0 },
          requires: { buildings: { building1: { value: 2 } } },
          provides: { resources: {} }
        }
      };
      buildingsMock = {
        all: function() { return buildings; },
        get: function(k) { return buildings[k]; }
      };
      sinon.spy(buildingsMock, 'all');
      sinon.spy(buildingsMock, 'get');
      $provide.service('Buildings', function() {
        this.all = buildingsMock.all;
        this.get = buildingsMock.get;
      });

      craftingMock = {
        all: function() { return {}; }
      };
      sinon.spy(craftingMock, 'all');
      $provide.service('Crafting', function() {
        this.all = craftingMock.all;
      });

      const resources = {
        resource1: { name: 'R1', rate: 0, value: { current: 5 } },
        resource2: { name: 'R2', rate: 0, value: { current: 4 } },
        resource3: { name: 'R3', rate: 0, value: { current: 3 } }
      };
      resourcesMock = {
        all: function() { return resources; },
        get: function(k) { return resources[k]; }
      };
      sinon.spy(resourcesMock, 'all');
      sinon.spy(resourcesMock, 'get');
      $provide.service('Resources', function() {
        this.all = resourcesMock.all;
        this.get = resourcesMock.get;
      });

      const tribe = {
        tribe1: {
          value: { current: 1 },
          requires: { resources: {} },
          provides: { resources: { resource3: { rate: 0.33 } } }
        }
      };
      tribeMock = {
        free: function() { return 1; },
        add: sinon.stub(),
        all: function() { return tribe; },
        get: function(k) { return tribe[k]; }
      };
      sinon.spy(tribeMock, 'all');
      sinon.spy(tribeMock, 'free');
      sinon.spy(tribeMock, 'get');
      $provide.service('Tribe', function() {
        this.all = tribeMock.all;
        this.add = tribeMock.add;
        this.free = tribeMock.free;
        this.get = tribeMock.get;
      });
    });

    inject(($injector) => {
      Actions = $injector.get('Actions');

      sinon.spy(Actions, 'initResource');
      sinon.spy(Actions, 'isBuyable');
      sinon.spy(Actions, 'unlockAll');
    });
  });

  afterEach(() => {
    Actions.initResource.restore();
    Actions.isBuyable.restore();
    Actions.unlockAll.restore();
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

  describe('.provides', () => {
    it('returns single resources', () => {
      const item = { provides: { resources: { resource1: { rate: 1 } } } };
      const provides = Actions.provides(item);
      expect(provides).to.have.length(1);
    });

    it('returns multiple resources', () => {
      const item = { provides: { resources: { resource1: { rate: 1 }, resource2: { rate: 2 } } } };
      const provides = Actions.provides(item);
      expect(provides).to.have.length(2);
    });

    it('adds resource names', () => {
      const item = { provides: { resources: { resource1: { rate: 1 } } } };
      const provides = Actions.provides(item);
      expect(provides).to.deep.equal([{ name: 'R1', rate: 1 }]);
    });
  });

  describe('.requires', () => {
    it('returns single resources', () => {
      const item = { value: { current: 0 }, requires: { resources: { resource1: { rate: 1 } } } };
      const requires = Actions.requires(item);
      expect(requires).to.have.length(1);
    });

    it('returns multiple resources', () => {
      const item = { value: { current: 0 }, requires: { resources: { resource1: { rate: 1 }, resource2: { rate: 2 } } } };
      const requires = Actions.requires(item);
      expect(requires).to.have.length(2);
    });

    it('adds resource names, prices', () => {
      const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 1 } } } };
      const requires = Actions.requires(item);
      expect(requires).to.deep.equal([{value: 1, buynow: 1, affordable: true, name: 'R1'}]);
    });

    describe('buynow & afforability', () => {
      it('shows affordable resources', () => {
        const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 1 } } } };
        const requires = Actions.requires(item);
        const res = requires[0];

        expect(res.affordable).to.be.true;
        expect(res.buynow).to.equal(1);
      });

      it('shows non-affordable resources', () => {
        const item = { increase: 1, value: { current: 1 }, requires: { resources: { resource1: { value: 6 } } } };
        const requires = Actions.requires(item);
        const res = requires[0];

        expect(res.affordable).to.be.false;
        expect(res.buynow).to.equal(6);
      });

      it('shows non-affordable multi-buy resources', () => {
        const item = { increase: 2, value: { current: 1 }, requires: { resources: { resource1: { value: 3 } } } };
        const requires = Actions.requires(item);
        const res = requires[0];

        expect(res.affordable).to.be.false;
        expect(res.buynow).to.equal(6);
      });
    });
  });

  describe('.unlock', () => {
    it('ignores unlocked items', () => {
      const item = { locked: false };
      Actions.unlock(item);
      expect(item.locked).to.be.false;
    });

    describe('Buildings', () => {
      let item;

      beforeEach(() => {
        item = { locked: true, requires: { resources: {}, buildings: { building1: { value: 1 } } } };
      });

      it('stays locked with insufficient number', () => {
        buildingsMock.get('building1').value.current = 0;
        Actions.unlock(item);
        expect(item.locked).to.be.true;
      });

      it('becomes unlocked with sufficient number', () => {
        buildingsMock.get('building1').value.current = 1;
        Actions.unlock(item);
        expect(item.locked).to.be.false;
      });
    });

    describe('Resources', () => {
      let item;

      beforeEach(() => {
        item = { locked: true, requires: { resources: { resource1: { value: 6 } } } };
      });

      it('stays locked with insufficient number', () => {
        Actions.unlock(item);
        expect(item.locked).to.be.true;
      });

      it('becomes unlocked with sufficient number', () => {
        resourcesMock.get('resource1').value.current = 6;
        Actions.unlock(item);
        expect(item.locked).to.be.false;
      });
    });
  });

  describe('.unlockAll', () => {
    it('unlocks Buildings', () => {
      Actions.unlockAll();
      expect(buildingsMock.all).to.have.been.called;
    });

    it('unlocks Crafting', () => {
      Actions.unlockAll();
      expect(craftingMock.all).to.have.been.called;
    });

    it('unlocks Tribe', () => {
      Actions.unlockAll();
      expect(tribeMock.all).to.have.been.called;
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

  describe('.buy', () => {
    it('uses .isBuyable', () => {
      const item = { increase: 1, value: { current: 1 }, requires: { resources: {} }, locked: true };
      expect(Actions.buy(item)).to.be.false;
      expect(Actions.isBuyable).to.have.been.calledWith(item);
    });

    describe('buying', () => {
      it('requires/removes resource values/rates', () => {
        const item = { increase: 1, value: { current: 0 }, requires: { resources: { resource1: { value: 5, rate: 0 }, resource2: { value: 0, rate: 9.99 } } }, provides: { resources: {} } };
        expect(Actions.buy(item)).to.be.true;
        expect(resourcesMock.get('resource1').value.current).to.equal(0);
        expect(resourcesMock.get('resource2').rate).to.equal(-9.99);
      });

      it('provides/adds resource values/rates', () => {
        const item = { increase: 1, value: { current: 0 }, provides: { resources: { resource1: { value: 5, rate: 0 }, resource2: { value: 0, rate: 9.99 } } }, requires: { resources: {} } };
        expect(Actions.buy(item)).to.be.true;
        expect(resourcesMock.get('resource1').value.current).to.equal(10);
        expect(resourcesMock.get('resource2').rate).to.equal(9.99);
      });

      it('requires/removes tribe free', () => {
        const item = { increase: 1, value: { current: 0 }, requires: { resources: {}, tribe: 1 }, provides: { resources: {} } };
        expect(Actions.buy(item)).to.be.true;
        expect(tribeMock.add).to.have.been.calledWith(-1);
      });

      it('provides/adds tribe free', () => {
        const item = { increase: 1, value: { current: 0 }, requires: { resources: {} }, provides: { resources: {}, tribe: 1 } };
        expect(Actions.buy(item)).to.be.true;
        expect(tribeMock.add).to.have.been.calledWith(1);
      });

      it('calls .unlockAll', () => {
        const item = { increase: 1, value: { current: 0 }, requires: { resources: {} }, provides: { resources: {} } };
        expect(Actions.buy(item)).to.be.true;
        expect(Actions.unlockAll).to.have.been.called;
      });
    });

    // describe('with .isBuyable', () => {
    //   it('passes simple items', () => {
    //     const item = { increase: 1, value: { current: 1 }, requires: { resources: {} }, provides: { resources: {} } };
    //     expect(Actions.buy(item)).to.be.true;
    //   });
    //
    //   it('ignores non-buyable items', () => {
    //     const item = { increase: 1, value: { current: 1 }, requires: { resources: {} }, locked: true };
    //     expect(Actions.buy(item)).to.be.false;
    //   });
    // });
  });
});
