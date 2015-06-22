app = angular.module('LEDApp',[
  "ui.bootstrap",
  "ui.slider"
])


app.controller('LEDController',[ '$scope', 'firePallate', 'Flame', 'FirePit',
  function($scope, firePallate, Flame, FirePit) {

    var container = $('.mylights')[0]; // Container DIV in the page
    var rAF_id = requestAnimationFrame(animate);
    var burnedOut = new Flame(32);
    var flame01 = new Flame(13, 0.2, 1.0);
    var flame02 = new Flame(11, 0.1, 0.9);
    var flame03 = new Flame(11, 0.5, 1.0);
    var firePit = new FirePit(32, firePallate);


    $scope.numFlames = {};
    $scope.numFlames.level = 9
    $scope.numFlames.min = 1;
    $scope.numFlames.max = 12;

    $scope.fSize = {};
    $scope.fSize.range = [4, 10];
    $scope.fSize.min = 3;
    $scope.fSize.max = 30;

    $scope.rageRange = {};
    $scope.rageRange.range = [20, 50];
    $scope.rageRange.min = 10;
    $scope.rageRange.max = 100;

    $scope.maxIntense = {};
    $scope.maxIntense.range = [90, 100];
    $scope.maxIntense.min = 50;
    $scope.maxIntense.max = 100;

    $scope.strength = {};
    $scope.strength.range = [1, 2];
    $scope.strength.min = 1;
    $scope.strength.max = 3;

    $scope.offset = {};
    $scope.offset.range = [0, 32];
    $scope.offset.min = 0;
    $scope.offset.max = 32;
    // var strengthRange = [];

    firePit.pushFlame(flame01);
    // firePit.pushFlame(flame02, 5);
    // firePit.pushFlame(flame03, 25);

    var strip = LEDstrip(container, firePit.getSize()) // Initialize
      .setcolors(firePit.getColors())  // chain commands
      .send();


    function addFlame(pit) {
      rSize = Math.round((Math.random() * ($scope.fSize.range[1]-$scope.fSize.range[0]) + $scope.fSize.range[0]));
      rRage = Math.round((Math.random() * ($scope.rageRange.range[1]-$scope.rageRange.range[0]) + $scope.rageRange.range[0]))/100;
      rIntense = Math.round((Math.random() * ($scope.maxIntense.range[1]-$scope.maxIntense.range[0]) + $scope.maxIntense.range[0]))/100;
      rStrength = Math.round((Math.random() * ($scope.strength.range[1]-$scope.strength.range[0]) + $scope.strength.range[0]));
      rOffset = Math.round((Math.random() * ($scope.offset.range[1]-$scope.offset.range[0]) + $scope.offset.range[0]));
      f = new Flame(rSize, rRage, rIntense, rStrength);
      // f = new Flame(13, 0.5, 1.0, 1);
      pit.pushFlame(f, rOffset);
      // console.log("rOffset:");
      // console.log(rOffset);
      // console.log("rRage: ");
      // console.log(rRage);
      // console.log("rIntense: ");
      // console.log(rIntense);
      // console.log("rStrength: ");
      // console.log(rStrength);

      return pit;
    }

    function animate() {
      rAF_id = requestAnimationFrame(animate);
      //if (i == size) i = 0; // loop around the array

      // colors = getRandomColors(colors);
      // colors = assignColorArrayToColors(pallate)(colors);


      while (firePit.getFlameCount() < $scope.numFlames.level) {
        firePit = addFlame(firePit);
      }

      firePit.fire();
      // firePit._stepFlames();
      // firePit._lightFlames();
      // flame01.next();
      // flame02.next();
      // flame03.next();
      // firePit.setFlame(flame01);
      // firePit.mergeFlame(flame02, 25);
      // firePit.mergeFlame(flame03, 20);
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

      function Flame(width, rage, maxIntense, strength) {
        /*
         * width: width in cells
         * rage:  speed of fire growth (%)
         * maxIntense: max brightness/intensity (%)
         * strength: how many cycles fire will ebb
         *
         *
         *
         *
         */
        if (typeof rage == "undefined" || rage == null) rage = 1.0;
        if (typeof maxIntense == "undefined" || maxIntense == null) maxIntense = 1.0;
        if (typeof strength == "undefined" || strength == null) strength = 1;
        this.width = width;
        this.amplitudePercent = 0;
        this.grow = true;
        this.rage = rage;
        this._rage_inc = 15*(this.rage);
        this.maxIntense = maxIntense;
        this.strength = strength;
        this.flameIntensities = [];
        this._cycles = 0;
        this._init();
        this._dead = false;
      }

      Flame.prototype._init = function() {
        // initialize flame
        self = this;
        for (var i=0; i<self.width; i++)
        {
          self.flameIntensities.push(0.0);
        }
      };

      Flame.prototype._gaussian = function(x) {
        // var m = Math.sqrt(this.width) * Math.sqrt(2 * Math.PI);
        var m = 6.0 - (5.0*this.maxIntense);// Math.sqrt(2 * Math.PI);
        var e = Math.exp(-Math.pow(x - (this.width/2.5), 2) / (2 * this.width));
        return e / m;
      };

      Flame.prototype._step = function() {
        if (this.grow)
          this.amplitudePercent += this._rage_inc;
        else
          this.amplitudePercent -= this._rage_inc;
        if (this.amplitudePercent >= 100) this.grow = false;
        if (this.amplitudePercent <= 0) {
          this.grow = true;
          this._cycles += 1;
          if (this._cycles >= this.strength) this._dead = true;
        }
      };

      Flame.prototype._newIntensities = function() {
        self = this;
        for (var i=0; i<self.width; i++)
        {
          percent = self._gaussian(i)*(self.amplitudePercent/100);
          // percent = self.amplitudePercent / 100;
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

      Flame.prototype.getCycles = function() {
        return this._cycles;
      };

      Flame.prototype.isDead = function() {
        return this._dead;
      };

      return Flame;

});


app.factory('FirePit', function() {

      function FirePit(size, pallate) {
        this.pallate = pallate;
        this._size = size;
        this._init();
        this._flames = [];
        this._flameOffsets = [];
      }

      FirePit.prototype._init = function() {
        self = this;
        self.colorValueSpan = [];
        self.intensityValueSpan = [];
        self.pallateIndexSpan = [];
        for (var i=0; i<self.getSize(); i++)
        {
            self.colorValueSpan.push([0, 0, 0]);
            self.intensityValueSpan.push(0.0);
            self.pallateIndexSpan.push(0);
        }
      };

      FirePit.prototype.pushFlame = function(flame, offset) {
        if (typeof offset == "undefined" || offset == null) offset = 0;
        this._flames.push(flame);
        this._flameOffsets.push(offset);
      }

      FirePit.prototype._stepFlames = function() {
        for (var i=0; i<this._flames.length; i++) {
          this._flames[i].next();
        }
      }

      // FirePit.prototype._removeFlame = function(flame) {
      //   self = this;
      //   for (var i=0; i<this._flames.length; i++) {
      //     if (this._flames[i] == flame) {
      //       this.
      //     }
      //   }
      // }

      FirePit.prototype._cleanFlames = function() {
        self = this;
        for (var i=0; i<this._flames.length; i++) {
          if (self._flames[i].isDead()) {
            self._flames.splice(i, 1);
            self._flameOffsets.splice(i, 1);
          }
        }        
      }

      FirePit.prototype._lightFlames = function() {
        self = this;
        if (this._flames.length > 0) this.setFlame(this._flames[0], this._flameOffsets[0]);
        for (var i=1; i<self._flames.length; i++) {
          this.mergeFlame(this._flames[i], this._flameOffsets[i]);
        } 
      }

      FirePit.prototype.fire = function() {
        this._cleanFlames();
        this._stepFlames();
        this._lightFlames();
      }

      FirePit.prototype._mergeIntensities = function(intensities, offset) {
        self = this;
        intensities.forEach(function(val, idx)
        {
          if ((offset+idx) < self.intensityValueSpan.length)
          {
            currentI = self.intensityValueSpan[offset+idx];
            newI = val;
            self.intensityValueSpan[offset+idx] = (currentI+newI)/2;
          }
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
        self._init();
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

      FirePit.prototype.getFlameCount = function() {
        return this._flames.length;
      };

      return FirePit;
});



app.constant('firePallate',
  (function () {
    range01 = [
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

    ];

    range02 = [
      [0, 0, 0],
      [50, 0, 0],
      [100, 0, 0],
      [125, 0, 0],
      [150, 0, 0],
      [175, 0, 0],
      [200, 0, 0],
      [225, 0, 0],
      [250, 25, 0],
      [250, 50, 0],
      [250, 75, 0],
      [250, 100, 0],
      [250, 125, 0],
      [250, 150, 0],
      [250, 175, 0],
      [250, 200, 0],
      [250, 225, 0],
      [250, 250, 0],
      [250, 250, 25],
      [255, 255, 50],
      [255, 255, 75],
      [250, 250, 100],
      [250, 250, 125],
      [255, 255, 150],
      [255, 255, 150],
      [255, 255, 175],
      [255, 255, 175],
      [255, 255, 200],
      [255, 255, 200],
      [255, 255, 225],
      [255, 255, 255],
      [255, 255, 255],

    ];

    return range02
  })()


);
