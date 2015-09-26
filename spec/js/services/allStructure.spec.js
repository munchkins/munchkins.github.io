describe('Exposed Services', function() {
  beforeEach(function() {
    module('munchkins');
  });

  const TYPES_BUILDINGS = {
    garden: true, shelter: true, quarry: true, hut: true, monolith: true, fire: true, trap: true, pond: true
  };

  const TYPES_CRAFTING = {
    collect: true, processing: true, press: true, hunt: true
  };

  const TYPES_RESOURCES = {
    flowers: true, stems: true, petals: true, paper: true, rocks: true, tools: true, seeds: true, faith: true, happiness: true, charcoal: true, furs: true, water: true
  };

  const TYPES_TRIBE = {
    farmer: true, tooler: true, priest: true, cook: true
  };

  const testExpected = function(source, exp) {
    it('has all expected resources', inject(function($injector) {
      const res = $injector.get(source);
      _.forEach(exp, function(b, k) {
        expect(res.get(k) ? true : `${k}`).to.be.true;
      });
    }));

    it('has no additional resources', inject(function($injector) {
      _.forEach($injector.get(source).keys(), function(k) {
        expect(exp[k] || `${k}`).to.be.true;
      });
    }));
  };

  const testResources = function(source, exp) {
    describe(source, function() {
      testExpected(source, exp);

      const fields = {
        name: true, description: true, rate: true, gamerate: true,
        value: { current: true, limit: true }
      };

      describe('containing', function() {
        _.forEach(exp, function(b, k) {
          describe(`${k}`, function() {
            it('has valid fields', inject(function($injector) {
              const res = $injector.get(source).get(k);

              expect(res.name).to.be.ok;
              expect(res.description).to.be.ok;
              expect(res.rate || (res.rate === 0) ? 0 : 'rate').to.be.at.least(0);

              expect(res.value).to.be.ok;
              expect(res.value.current || (res.value.current === 0) ? 0 : 'value.current').to.be.at.least(0);
              expect(res.value.limit || (res.value.limit === 0) ? 0 : 'value.limit').to.be.at.least(0);
            }));

            it('has no invalid fields', inject(function($injector) {
              const res = $injector.get(source).get(k);

              _.forEach(Object.keys(res), function(f) {
                if (_.isObject(fields[f])) {
                  _.forEach(Object.keys(fields[f]), function(s) {
                    expect(fields[f][s] || `${f}.${s}`).to.be.true;
                  });
                } else {
                  expect(fields[f] || `${f}`).to.be.true;
                }
              });
            }));
          });
        });
      });
    });
  };

  const testStructure = function(source, exp) {
    describe(source, function() {
      testExpected(source, exp);

      const fields = {
        name: true, description: true, locked: true, increase: true,
        value: { current: true, limit: true, level: true },
        requires: true, provides: true, hasRequires: true, hasProvides: true
      };

      describe('containing', function() {
        _.forEach(exp, function(b, k) {
          describe(`${k}`, function() {
            it('has valid fields', inject(function($injector) {
              const res = $injector.get(source).get(k);

              expect(res.name).to.be.ok;
              expect(res.description).to.be.ok;
              expect(res.increase || 'increase').to.be.at.least(1);
            }));

            it('has no invalid fields', inject(function($injector) {
              const res = $injector.get(source).get(k);

              _.forEach(Object.keys(res), function(f) {
                if (_.isObject(fields[f])) {
                  _.forEach(Object.keys(fields[f]), function(s) {
                    expect(fields[f][s] || `${f}.${s}`).to.be.true;
                  });
                } else {
                  expect(fields[f] || `${f}`).to.be.true;
                }
              });
            }));

            const expectRequires = function(requires) {
              const reqs = {
                tribe: true, buildings: true, resources: true
              };

              expect(requires).to.be.ok;

              _.forEach(requires, function(req, type) {
                expect(reqs[type] || `${type}`).to.be.true;

                let allow = null;
                if (type === 'resources') {
                  allow = TYPES_RESOURCES;
                } else if (type === 'buildings') {
                  allow = TYPES_BUILDINGS;
                }

                if (allow) {
                  _.forEach(requires[type], function(item, name) {
                    expect(allow[name] || `${name}`).to.be.true;
                  });
                }
              });
            };

            it('has valid requires', inject(function($injector) {
              const res = $injector.get(source).get(k);
              expectRequires(res.requires);
            }));

            it('has valid provides', inject(function($injector) {
              const res = $injector.get(source).get(k);
              expectRequires(res.provides);
            }));
          });
        });
      });
    });
  };

  testResources('Resources', TYPES_RESOURCES);
  testStructure('Buildings', TYPES_BUILDINGS);
  testStructure('Crafting', TYPES_CRAFTING);
  testStructure('Tribe', TYPES_TRIBE);
});
