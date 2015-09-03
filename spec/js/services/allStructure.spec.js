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

  const testStructure = function(item) {
    expect(item.name).to.be.ok;
    expect(item.description).to.be.ok;
  };

  const testResource = function(item) {
    expect(item.name).to.be.ok;
    expect(item.description).to.be.ok;
  };

  it('Has Correct Resource Structure', function() {
    _.forEach(Resources.all(), testResource);
  });

  it('Has Correct Building Structure', function() {
    _.forEach(Buildings.all(), testStructure);
  });

  it('Has Correct Crafting Structure', function() {
    _.forEach(Crafting.all(), testStructure);
  });

  it('Has Correct Tribe Structure', function() {
    _.forEach(Tribe.all(), testStructure);
  });
});
