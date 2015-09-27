describe('Game', () => {
  let Defaults;
  let Game;

  let actionsMock;
  let buildingsMock;
  let craftingMock;
  let resourcesMock;
  let tribeMock;

  beforeEach(() => {
    module('munchkins');

    module(($provide) => {
      actionsMock = { initResources: sinon.stub() };
      $provide.service('Actions', function() {
        this.initResources = actionsMock.initResources;
      });

      buildingsMock = { load: sinon.stub(), save: sinon.stub() };
      $provide.service('Buildings', function() {
        this.load = buildingsMock.load;
        this.save = buildingsMock.save;
      });

      craftingMock = { load: sinon.stub(), save: sinon.stub() };
      $provide.service('Crafting', function() {
        this.load = craftingMock.load;
        this.save = craftingMock.save;
      });

      resourcesMock = { load: sinon.stub(), save: sinon.stub(), all: function() {
        return {};
      }};
      $provide.service('Resources', function() {
        this.load = resourcesMock.load;
        this.save = resourcesMock.save;
      });

      tribeMock = { load: sinon.stub(), save: sinon.stub() };
      $provide.service('Tribe', function() {
        this.load = tribeMock.load;
        this.save = tribeMock.save;
      });
    });

    inject(($injector) => {
      Defaults = $injector.get('Defaults');
      Game = $injector.get('Game');

      sinon.spy(Game, 'load');
      sinon.spy(Game, 'calcBonus');
      sinon.spy(Game, 'calcCalendar');
    });
  });

  afterEach(() => {
    Game.load.restore();
    Game.calcBonus.restore();
    Game.calcCalendar.restore();
  });

  describe('on init', () => {
    // small issue: injector calls, so we miss it
    /* it('calls .load', () => {
      expect(Game.load).to.have.been.called;
    }); */

    it('does action init', () => {
      expect(actionsMock.initResources).to.have.been.called;
    });
  });

  describe('.load', () => {
    describe('dependencies', () => {
      it('loads buildings', () => {
        expect(buildingsMock.load).to.have.been.called;
      });

      it('loads crafting', () => {
        expect(craftingMock.load).to.have.been.called;
      });

      it('loads resources', () => {
        expect(resourcesMock.load).to.have.been.called;
      });

      it('loads tribe', () => {
        expect(tribeMock.load).to.have.been.called;
      });
    });
  });

  describe('.save', () => {
    describe('dependencies', () => {
      it('saves buildings', () => {
        Game.save();
        expect(buildingsMock.save).to.have.been.called;
      });

      it('saves crafting', () => {
        Game.save();
        expect(craftingMock.save).to.have.been.called;
      });

      it('saves resources', () => {
        Game.save();
        expect(resourcesMock.save).to.have.been.called;
      });

      it('saves tribe', () => {
        Game.save();
        expect(tribeMock.save).to.have.been.called;
      });
    });
  });

  describe('calendar', () => {
    describe('day calculation', () => {
      it('stays within a day based on defaults', () => {
        const cal = Game.calendar();
        Game.game().ticks = Defaults.DAY_TICKS - 1;
        Game.calcCalendar();

        expect(cal.day).to.equal(0);
        expect(cal.season).to.equal(0);
        expect(cal.year).to.equal(0);
      });

      it('swaps to next day on tick boundary', () => {
        const cal = Game.calendar();
        Game.game().ticks = Defaults.DAY_TICKS;
        Game.calcCalendar();

        expect(cal.day).to.equal(1);
        expect(cal.season).to.equal(0);
        expect(cal.year).to.equal(0);
      });
    });
  });
});
