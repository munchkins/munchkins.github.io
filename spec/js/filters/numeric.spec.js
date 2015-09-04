describe('Numeric Filter', function() {
  let filter = undefined;

  beforeEach(function() {
    module('munchkins');

    inject(function(_$filter_) {
      filter = _$filter_('numeric');
    });
  });

  it('exists', function() {
    expect(filter).to.be.ok;
  });

  it('returns 0.00 on no value', function() {
    expect(filter()).to.eq('0.00');
  });

  it('returns values with default precision', function() {
    expect(filter(100)).to.eq('100.00');
  });

  it('returns arbitrary precision', function() {
    expect(filter(55.6789, 0)).to.eq('56');
    expect(filter(55.6789, 1)).to.eq('55.7');
    expect(filter(55.6789, 5)).to.eq('55.67890');
  });

  it('returns values < 1.0', function() {
    expect(filter(0.59)).to.eq('0.59');
  });

  it('returns K values', function() {
    expect(filter(1100)).to.eq('1.10K');
    expect(filter(9990)).to.eq('9.99K');
  });

  it('returns M values', function() {
    expect(filter(1100000)).to.eq('1.10M');
    expect(filter(9990000)).to.eq('9.99M');
  });

  it('returns G values', function() {
    expect(filter(1100000000)).to.eq('1.10G');
    expect(filter(9990000000)).to.eq('9.99G');
  });

  it('returns T values', function() {
    expect(filter(1100000000000)).to.eq('1.10T');
    expect(filter(9990000000000)).to.eq('9.99T');
  });

  it('returns P values', function() {
    expect(filter(1100000000000000)).to.eq('1.10P');
    expect(filter(9990000000000000)).to.eq('9.99P');
  });
});
