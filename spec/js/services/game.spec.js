describe('Game', () => {
  let Game;

  let actionInit;
  let bldSave;
  let bldLoad;
  let cftLoad;
  let cftSave;
  let resLoad;
  let resSave;
  let trbLoad;
  let trbSave;

  beforeEach(() => {
    module('munchkins');

    module(($provide) => {
      actionInit = sinon.stub();
      $provide.service('Actions', function() {
        this.initResources = actionInit;
      });

      bldLoad = sinon.stub();
      bldSave = sinon.stub();
      $provide.service('Buildings', function() {
        this.load = bldLoad;
        this.save = bldSave;
      });

      cftLoad = sinon.stub();
      cftSave = sinon.stub();
      $provide.service('Crafting', function() {
        this.load = cftLoad;
        this.save = cftSave;
      });

      resLoad = sinon.stub();
      resSave = sinon.stub();
      $provide.service('Resources', function() {
        this.load = resLoad;
        this.save = resSave;
      });

      trbLoad = sinon.stub();
      trbSave = sinon.stub();
      $provide.service('Tribe', function() {
        this.load = trbLoad;
        this.save = trbSave;
      });
    });

    inject(($injector) => {
      Game = $injector.get('Game');
    });
  });

  describe('on init', () => {
    it('calls .load on Buildings, Crafing, Resources & Tribe', () => {
      expect(bldLoad).to.have.been.called;
      expect(cftLoad).to.have.been.called;
      expect(resLoad).to.have.been.called;
      expect(trbLoad).to.have.been.called;
    });

    it('calls Actions.initResources', () => {
      expect(actionInit).to.have.been.called;
    });
  });

  describe('.save', () => {
    it('calls .save on Buildings, Crafing, Resources & Tribe', () => {
      Game.save();
      expect(bldSave).to.have.been.called;
      expect(cftSave).to.have.been.called;
      expect(resSave).to.have.been.called;
      expect(resLoad).to.have.been.called;
    });
  });
});
