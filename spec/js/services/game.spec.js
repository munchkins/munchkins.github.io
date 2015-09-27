describe('Game', () => {
  let Defaults;
  let Game;

  let actionsMock;
  let buildingsMock;
  let craftingMock;
  let resourcesMock;
  let tribeMock;

  let testResource;

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

      testResource = {
        rate: 0.1,
        value: { current: 100 }
      };
      resourcesMock = { load: sinon.stub(), save: sinon.stub() };
      $provide.service('Resources', function() {
        this.all = function() {
          return { test: testResource };
        };

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

  describe('bonus', () => {
    describe('increments', () => {
      it('adds 1% for year 1', () => {
        Game.game().ticks = Defaults.YEAR_TICKS;
        Game.calcBonus();

        expect(Game.bonus()).to.equal(0.01);
      });

      it('adds 1.5% for year 1.25', () => {
        Game.game().ticks = Defaults.YEAR_TICKS + Defaults.SEASON_TICKS;
        Game.calcBonus();

        expect(Game.bonus()).to.equal(0.0125);
      });

      it('adds 11% for year 11', () => {
        Game.game().ticks = Defaults.YEAR_TICKS * 11;
        Game.calcBonus();

        expect(Game.bonus()).to.equal(0.11);
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

  describe('.tick', () => {
    it('increments the game ticks', () => {
      const game = Game.game();
      game.ticks = 1233;
      Game.tick();

      expect(game.ticks).to.equal(1234);
    });

    describe('calculations', () => {
      it('updates the game bonus', () => {
        expect(Game.calcBonus).not.to.have.been.called;
        Game.tick();
        expect(Game.calcBonus).to.have.been.called;
      });

      it('updates the calendar', () => {
        expect(Game.calcCalendar).not.to.have.been.called;
        Game.tick();
        expect(Game.calcCalendar).to.have.been.called;
      });
    });

    describe('resources', () => {
      it('updates the game-rate', () => {
        Game.tick();
        expect(testResource.gamerate).to.equal(0.1);
      });

      it('updates the value by the gamerate', () => {
        Game.tick();
        expect(testResource.value.current).to.equal(100.1);
      });

      it('allows no negative values', () => {
        testResource.value.current = -1234;
        Game.tick();
        expect(testResource.value.current).to.equal(0);
      });

      it('only updates to the limit (when available)', () => {
        testResource.value.limit = 50;
        Game.tick();
        expect(testResource.value.current).to.equal(50);
      });
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
});
