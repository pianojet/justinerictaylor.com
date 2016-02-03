    function getColors1()
    {
      var colors = [ // blue gradient
        [0,0,50],
        [0,0,100],
        [0,0,150],
        [0,0,200],
        [0,0,250]
      ];
      return colors;
    }

    function getColors2()
    {
      var colors = [];
      for (var i=0; i<maxLights; i++)
      {
          colors[i] = [50, 50, 50];
      }
      colors[0] = [0, 0, 50];
      colors[1] = [0, 0, 100];
      colors[2] = [0, 0, 150];
      colors[3] = [0, 0, 200];
      colors[4] = [0, 0, 250];
      return colors;
    }

    var maxLights = 20;
    var container = $('.mylights')[0]; // Container DIV in the page
    var colors = getColors2();
    var size = colors.length;
 
    /**
     * Set colors, and send to strip using chaining.
     */
    var strip = LEDstrip(container, size) // Initialize
      .setcolors(colors)  // chain commands
      .send();
    /**
     * Manipulate the color buffer. Example of using seperate
     * function calls.
     */
    colors.forEach(function(val,idx){ // fiddle with colors
      colors[idx][0] = colors[(size-1)-idx][2];
      /** 
       * g = (r + b) / 2
       */
      colors[idx][1] = (colors[idx][0] + colors[idx][2]) >> 1;
    });
    
    strip.buffer = colors; // set the color buffer directly
    strip.send();

    /**
     * Animation loops. Manipulate the buffer, and send values.
     *
     * animate() is a function that manipulates strip.buffer[]...
     */
    var i = 0;
    var rAF_id = requestAnimationFrame(animate);
    
    // Think of this function like the loop() call in the Arduino IDE
    function animate() {
      rAF_id = requestAnimationFrame(animate);
      //if (i == size) i = 0; // loop around the array

      colors.forEach(function(val, idx)
      {
        
        /* generate random rgb values */
        colors[idx][0] = Math.floor(Math.random() * 255);
        colors[idx][1] = Math.floor(Math.random() * 255);
        colors[idx][2] = Math.floor(Math.random() * 255);
      });
      strip.buffer = colors;
      strip.send();
    }

    /* When you want to end the animation: */
    // cancelAnimationFrame(rAF_id);
