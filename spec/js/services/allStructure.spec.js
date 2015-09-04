describe('Exposed Services', function() {
  beforeEach(function() {
    module('munchkins');
  });

  const testExpected = function(source, exp) {
    describe('all expected resources', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} is a resource`, inject(function($injector) {
          expect($injector.get(source).get(k)).to.be.ok;
        }));
      });
    });

    describe('no additional resources', function(done) {
      inject(function($injector) {
        _.forEach($injector.get(source).keys(), function(k) {
          it(`${k} is an expected resource`, function() {
            expect(exp[k]).to.be.true;
          });
        });
        done();
      });
    });
  };

  const testResources = function(source, exp) {
    testExpected(source, exp);

    describe('valid resources', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} has valid info`, inject(function($injector) {
          const res = $injector.get(source).get(k);
          expect(res.name).to.be.ok;
          expect(res.description).to.be.ok;
          expect(res.value).to.be.ok;
          expect(res.value.current).to.be.at.least(0);
          expect(res.value.limit).to.be.at.least(0);
          expect(res.rate).to.be.at.least(0);
        }));
      });
    });
  };

  const testStructure = function(source, exp) {
    testExpected(source, exp);

    describe('valid structure', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} has valid info`, inject(function($injector) {
          const res = $injector.get(source).get(k);
          expect(res.name).to.be.ok;
          expect(res.description).to.be.ok;
          expect(res.requires).to.be.ok;
          expect(res.provides).to.be.ok;
        }));
      });
    });
  };

  describe('Resource Structure', function() {
    testResources('Resources', {
      flowers: true, stems: true, petals: true, paper: true, rocks: true
    });
  });

  describe('Building Structure', function() {
    testStructure('Buildings', {
      meadow: true, shelter: true, quarry: true
    });
  });

  describe('Crafting Structure', function() {
    testStructure('Crafting', {
      collect: true, processing: true, press: true
    });
  });

  /*describe('Tribe Structure', function() {
    testStructure('Tribe', {
      farmer: true
    });
  });*/
});
