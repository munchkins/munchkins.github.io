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
      $provide.service('Tribe', function() {
        this.all = tribeMock.all;
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
});
