describe('Numeric Filter', () => {
  let filter = undefined;

  beforeEach(() => {
    module('munchkins');

    inject(($filter) => {
      filter = $filter('numeric');
    });
  });

  it('exists', () => {
    expect(filter).to.be.ok;
  });

  it('returns 0.00 on no value', () => {
    expect(filter()).to.eq('0.000');
  });

  it('returns values with default precision', () => {
    expect(filter(123.4557)).to.eq('123.456');
  });

  it('returns arbitrary precision', () => {
    expect(filter(55.6789, 0)).to.eq('56');
    expect(filter(55.6789, 1)).to.eq('55.7');
    expect(filter(55.6789, 5)).to.eq('55.67890');
  });

  it('uses precision 3 when none specified for numbers > 1000', () => {
    expect(filter(12345, 0)).to.eq('12.345K');
  });

  it('returns values < 1.0', () => {
    expect(filter(0.59213)).to.eq('0.592');
  });

  it('returns K values', () => {
    expect(filter(1103)).to.eq('1.103K');
    expect(filter(9994)).to.eq('9.994K');
  });

  it('returns M values', () => {
    expect(filter(1103000)).to.eq('1.103M');
    expect(filter(9994000)).to.eq('9.994M');
  });

  it('returns G values', () => {
    expect(filter(1103000000)).to.eq('1.103G');
    expect(filter(9994000000)).to.eq('9.994G');
  });

  it('returns T values', () => {
    expect(filter(1103000000000)).to.eq('1.103T');
    expect(filter(9994000000000)).to.eq('9.994T');
  });

  it('returns P values', () => {
    expect(filter(1103000000000000)).to.eq('1.103P');
    expect(filter(9994000000000000)).to.eq('9.994P');
  });
});
