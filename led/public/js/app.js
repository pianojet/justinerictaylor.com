app = angular.module('LEDApp',[])


app.controller('LEDController',[ '$scope', 'firePallate', 'Flame', 'FirePit',
  function($scope, firePallate, Flame, FirePit) {

    var container = $('.mylights')[0]; // Container DIV in the page
    var rAF_id = requestAnimationFrame(animate);
    var burnedOut = new Flame(32);
    var flame01 = new Flame(7);
    var flame02 = new Flame(5, 2);
    var firePit = new FirePit(32, firePallate);

    firePit.setFlame(burnedOut);
    firePit.setFlame(flame01);
    firePit.setFlame(flame02)

    var strip = LEDstrip(container, firePit.getSize()) // Initialize
      .setcolors(firePit.getColors())  // chain commands
      .send();

    function animate() {
      rAF_id = requestAnimationFrame(animate);
      //if (i == size) i = 0; // loop around the array

      // colors = getRandomColors(colors);
      // colors = assignColorArrayToColors(pallate)(colors);

      flame01.next();
      flame02.next();
      firePit.setFlame(flame01);
      firePit.setFlame(flame02, 10);
      try {
        strip.buffer = firePit.getColors();
        strip.send();
      }
      catch(err) {
        debugger
      }
    }

}]);

app.factory('Flame', function() {

      function Flame(width, rage) {
        if (typeof rage == "undefined" || rage == null) rage = 1;
        this.width = width;
        this.amplitudePercent = 0;
        this.grow = true;
        this.rage = rage;
        this.flameIntensities = [];
        this._init();
      }

      Flame.prototype._init = function() {
        // initialize flame
        self = this;
        for (var i=0; i<self.width; i++)
        {
          self.flameIntensities.push(0.0);
        }
      };

      Flame.prototype._step = function() {
        if (this.grow)
          this.amplitudePercent += this.rage;
        else
          this.amplitudePercent -= this.rage;
        if (this.amplitudePercent >= 100) this.grow = false;
        if (this.amplitudePercent <= 0) this.grow = true;
      };

      Flame.prototype._newIntensities = function() {
        self = this;
        for (var i=0; i<self.width; i++)
        {
          percent = self.amplitudePercent / 100;
          self.flameIntensities[i] = percent;
        }        
      }

      Flame.prototype.next = function() {
        this._step();
        this._newIntensities();
      };

      Flame.prototype.getIntensities = function() {
        return this.flameIntensities;
      };

      return Flame;

});


app.factory('FirePit', function() {

      function FirePit(size, pallate) {
        this.pallate = pallate;
        this._size = size;
        this._init();
      }

      FirePit.prototype._init = function() {
        self = this;
        self.colorValueSpan = [];
        self.intensityValueSpan = [];
        self.pallateIndexSpan = [];
        for (var i=0; i<self.getSize(); i++)
        {
            self.colorValueSpan.push([150, 150, 150]);
            self.intensityValueSpan.push(0.0);
            self.pallateIndexSpan.push(0);
        }
      };

      FirePit.prototype._mergeIntensities = function(intensities, offset) {
        self = this;
        intensities.forEach(function(val, idx)
        {
          if ((offset+idx) < self.intensityValueSpan.length)
            self.intensityValueSpan[offset+idx] = val;
        });

      };

      FirePit.prototype._updateColors = function() {
        self = this;
        self.intensityValueSpan.forEach(function(val, idx)
        {
          pallateIndex = Math.floor(val*self.pallate.length);
          if (pallateIndex >= self.pallate.length) pallateIndex = self.pallate.length-1;
          if (pallateIndex < 0) pallateIndex = 0;
          self.colorValueSpan[idx] = self.pallate[pallateIndex];
        });
      };

      FirePit.prototype.mergeFlame = function(flame, offset) {
        if (typeof offset == "undefined" || offset == null) offset = 0;
        this._mergeIntensities(flame.getIntensities(), offset);
        this._updateColors();
      };

      FirePit.prototype.setFlame = function(flame, offset) {
        self = this;
        if (typeof offset == "undefined" || offset == null) offset = 0;
        flame.getIntensities().forEach(function(val, idx)
        {
          if ((offset+idx) < self.intensityValueSpan.length)
            self.intensityValueSpan[offset+idx] = val;
        });
        this._updateColors();
      };      

      FirePit.prototype.setColors = function(colors) {
        self = this;
        self._init();
        colors.forEach(function(val, idx)
        {
          self.colorValueSpan[idx][0] = val[0];
          self.colorValueSpan[idx][1] = val[1];
          self.colorValueSpan[idx][2] = val[2];
        });
      };

      FirePit.prototype.getColors = function() {
        return this.colorValueSpan;
      };

      FirePit.prototype.getSize = function() {
        return this._size;
      };

      return FirePit;
});



app.constant('firePallate',
  [
    [0, 0, 0], // 0
    [10, 0, 0],
    [25, 0, 0],
    [50, 0, 0],

    [75, 0, 0], // 4
    [100, 0, 0],
    [125, 0, 0],
    [150, 0, 0],

    [175, 0, 0], // 8
    [200, 0, 0],
    [225, 0, 0],
    [250, 25, 0],

    [250, 50, 0], // 12
    [250, 75, 0],
    [250, 100, 0],
    [250, 125, 0],

    [250, 150, 0], // 16
    [250, 175, 0],
    [250, 200, 0],
    [250, 225, 0],

    [250, 250, 0], // 20
    [250, 250, 25],
    [255, 255, 50],
    [255, 255, 75],

    [250, 250, 100], // 24
    [250, 250, 125],
    [255, 255, 150],
    [255, 255, 175],

    [255, 255, 200], // 28
    [255, 255, 225],
    [255, 255, 255],
    [255, 255, 255],

  ]
);
