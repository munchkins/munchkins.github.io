describe('All Exposed Structures', function() {
  let Buildings = undefined;
  let Crafting = undefined;
  let Resources = undefined;
  let Tribe = undefined;

  beforeEach(function() {
    module('munchkins');

    inject(function(_Buildings_, _Crafting_, _Resources_, _Tribe_) {
      Buildings = _Buildings_;
      Crafting = _Crafting_;
      Resources = _Resources_;
      Tribe = _Tribe_;
    });
  });

  describe('Resource Structure', function() {
    const exp = { flowers: true, stems: true, petals: true, paper: true, rocks: true };

    describe('all expected resources', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} is a resource`, function() {
          expect(Resources.get(k)).to.be.ok;
        });
      });
    });

    it('no additional resources', function() {
      _.forEach(Resources.keys(), function(k) {
        it(`${k} is an expected resource`, function() {
          expect(exp[k]).to.be.true;
        });
      });
    });

    describe('valid resources', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} has valid info`, function() {
          const res = Resources.get(k);
          expect(res.name).to.be.ok;
          expect(res.description).to.be.ok;
          expect(res.value).to.be.ok;
          expect(res.value.current).to.be.at.least(0);
          expect(res.value.limit).to.be.at.least(0);
          expect(res.rate).to.be.at.least(0);
        });
      });
    });
  });

  const testStructure = function(res) {
    expect(res.name).to.be.ok;
    expect(res.description).to.be.ok;
    expect(res.requires).to.be.ok;
    expect(res.provides).to.be.ok;
  };

  describe('Building Structure', function() {
    const exp = { meadow: true, shelter: true, quarry: true };

    describe('all expected resources', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} is a building`, function() {
          expect(Buildings.get(k)).to.be.ok;
        });
      });
    });

    it('no additional resources', function() {
      _.forEach(Buildings.keys(), function(k) {
        it(`${k} is an expected building`, function() {
          expect(exp[k]).to.be.true;
        });
      });
    });

    describe('valid buildings', function() {
      _.forEach(exp, function(b, k) {
        it(`${k} has valid info`, function() {
          testStructure(Buildings.get(k));
        });
      });
    });
  });
});
