(function( $ ) {

  var settings = {
    data : [],
    autoStart : false,
    controlsPosition : 'TR',
    welcomeMessage : '<h2 class="h2">Welcome to the jQuerin Grid Builder</h2>',
    buttons : {
      next : 'Next',
      prev : 'Previous',
      start : 'Start',
      end : 'End'
    },
    controlsColors : {
      background: 'rgba(8, 68, 142, 0.80)',
      color: '#fff'
    },
    tooltipColors : {
      background: 'rgba(8, 68, 142, 0.80)',
      color: '#fff'
    }
  };

  var options, step, steps;
  var ew, eh, el, et;
  var started = false;

  var $tooltip    = $('<div>',{
                      id         : 'tourtip',
                      className  : 'tourtip',
                      html       : ''
                    }).css({
                      'display'     : 'none',
                      'padding'     : '10px 20px',
                      'position'    : 'absolute',
                      'border-radius' : '8px',
                      'font-size'   : '1em',
                      'box-sizing'  : 'border-box'
                    });

  var methods = {
    init : function( opts ) {
      if (started == false ) {
        started = true;
        options = $.extend(settings, opts);
        
        controls = '<div id="tourControls">\
          <div id="tourText">'+options.welcomeMessage+'</div>\
          <div id="tourButtons">\
            <button id="tourPrev" style="display:none">'+options.buttons.prev+'</button>\
            <button id="tourNext">'+options.buttons.start+'</button>\
            <button id="tourEnd" style="display:none">'+options.buttons.end+'</button>\
          </div>\
        </div>';
        $controlsCss = { 'display' : 'block', 'position': 'fixed', 'width' : '200px', 'padding' : '10px 20px', 'border-radius' : '10px', 'font-family' : 'sans-serif' };
        $controls = $(controls).css($controlsCss).css(options.controlsColors);
        $cpos = methods.getControlPosition(options.controlsPosition);
        $controls.css($cpos);
        $('body').append($controls);

        $tooltip.css(options.tooltipColors);

        step = -1;
        steps = options.data.length;
        $('body').prepend($tooltip);  
      }
    },
    next : function() {
      step++;

      if (step == steps) {
        methods.destroy();
      }
      else {
        $tooltip.hide();
        stepData = options.data[step];

        if (step <= steps) {
          $('#tourPrev').show();
          $('#tourEnd').show();
          $('#tourNext').show().html('Next');
        }

        methods.setTooltip(stepData);
      }
    },
    prev : function() {
      $tooltip.hide();

      if (step < steps) {
        $('#tourNext').show().html(options.buttons.next);
      }

      if (step <= 0) {
        $('#tourPrev').hide();
        $('#tourEnd').hide();
        $('#tourNext').html(options.buttons.start);
        step--;
      }
      else {
        step--;
        stepData = options.data[step];

        methods.setTooltip(stepData);
      }
    },
    setTooltip : function(stepData) {
      $element = $(stepData.element);

      if (typeof stepData.callback != 'undefined') {
        if (stepData.callback == 'click') {
          if ($element.attr('href') != '') {
            location.href = $element.attr('href');
          }
          else {
            $element.click();  
          }
        }
      }
      else {
        if (stepData.controlsPosition) {
          methods.setControlsPosition(stepData.controlsPosition);
        }

        $tooltip.html(stepData.tooltip);
        if (stepData.text) {
          $('#tourText').html(stepData.text);
        }
        tooltipPos = (typeof stepData.position == 'undefined') ? 'BL' : stepData.position;
        $pos = methods.getTooltipPosition(tooltipPos, $element);
        
        $tooltip.css({ 'top': $pos.top+'px', 'left': $pos.left+'px' });
        $tooltip.show('fast');

        $.scrollTo($tooltip, 200, { offset : -100});
      }  
    },
    setControlsPosition : function(pos) {
      chtml = $controls.html();
      $controls.remove();
      $controls = $(controls).html(chtml);
      $controls = $controls.css($controlsCss).css(options.controlsColors);
      position = methods.getControlPosition(pos);
      $controls.css(position);
      $('body').append($controls);
    },
    getTooltipPosition : function(pos, $e) {
      ew = $element.outerWidth();
      eh = $element.outerHeight();
      el = $element.offset().left;
      et = $element.offset().top;
      tw = $tooltip.width() + parseInt($tooltip.css('padding-left')) + parseInt($tooltip.css('padding-right'));
      th = $tooltip.height() + parseInt($tooltip.css('padding-top')) +  + parseInt($tooltip.css('padding-bottom'));

      $('.tourArrow').remove();
      tbg = $tooltip.css('background-color');

      $upArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-left' : '5px solid transparent', 'border-right' : '5px solid transparent', 'border-bottom' : '5px solid '+tbg });
      $downArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-left' : '5px solid transparent', 'border-right' : '5px solid transparent', 'border-top' : '5px solid '+tbg });
      $rightArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-top' : '5px solid transparent', 'border-bottom' : '5px solid transparent', 'border-left' : '5px solid '+tbg });
      $leftArrow = $('<div class="tourArrow"></div>').css({ 'position' : 'absolute', 'display' : 'block', 'width' : '0', 'height' : '0', 'border-top' : '5px solid transparent', 'border-bottom' : '5px solid transparent', 'border-right' : '5px solid '+tbg });
      switch (pos) {
        case 'BL' :
          position = { 'left'  : el, 'top' : et + eh + 10 };
          $upArrow.css({ top: '-5px', left: '48%' });
          $tooltip.prepend($upArrow);
          break;

        case 'BR' :
          position = { 'left'  : el + ew - tw, 'top' : et + eh + 10 };
          $upArrow.css({ top: '-5px', left: '48%' });
          $tooltip.prepend($upArrow);
          break;

        case 'TL' :
          position = { 'left'  : el, 'top' : (et - th) -10 };
          $downArrow.css({ top: th, left: '48%' });
          $tooltip.append($downArrow);
          break;

        case 'TR' :
          position = { 'left'  : (el + ew) - tw, 'top' : et - th -10 };
          $downArrow.css({ top: th, left: '48%' });
          $tooltip.append($downArrow);
          break;

        case 'RT' :
          position = { 'left'  : el + ew + 10, 'top' : et };
          $leftArrow.css({ left: '-5px' });
          $tooltip.prepend($leftArrow);
          break;

        case 'RB' :
          position = { 'left'  : el + ew + 10, 'top' : et + eh - th };
          $leftArrow.css({ left: '-5px' });
          $tooltip.prepend($leftArrow);
          break;

        case 'LT' :
          position = { 'left'  : (el - tw) - 10, 'top' : et };
          $rightArrow.css({ right: '-5px' });
          $tooltip.prepend($rightArrow);
          break;

        case 'LB' :
          position = { 'left'  : (el - tw) - 10, 'top' : et + eh - th};
          $rightArrow.css({ right: '-5px' });
          $tooltip.prepend($rightArrow);
          break;

        case 'B'  :
          position = { 'left'  : el + ew/2 - tw/2, 'top' : (et + eh) + 10 };
          $upArrow.css({ top: '-5px', left: '48%' });
          $tooltip.prepend($upArrow);
          break;

        case 'L'  :
          position = { 'left'  : (el - tw) - 10, 'top' : et + eh/2 - th/2 };
          $rightArrow.css({ right: '-5px' });
          $tooltip.prepend($rightArrow);
          break;

        case 'T'  :
          position = { 'left'  : el + ew/2 - tw/2, 'top' : (et - th) - 10 };
          $downArrow.css({ top: th, left: '48%' });
          $tooltip.append($downArrow);
          break;

        case 'R'  :
          position = { 'left'  : (el + ew) + 10, 'top' : et + eh/2 - th/2 };
          $leftArrow.css({ left: '-5px' });
          $tooltip.prepend($leftArrow);
          break;
      }
      return position;
    },
    getControlPosition: function(pos) {
      switch (pos)
      {
        case 'TR':
          pos = { 'top' : '10px', 'right' : '10px' };
          break;

        case 'TL':
          pos = { 'top' : '10px', 'left' : '10px' };
          break;

        case 'BL':
          pos = { 'bottom' : '10px', 'left' : '10px' };
          break;

        case 'BR':
          pos = { 'bottom' : '10px', 'right' : '10px' };
          break;
      }
      return pos;
    },
    destroy : function() {
      $('#tourControls').remove();
      $('#tourtip').remove();
      $tooltip.css({ 'display' : 'none' }).html('');
      step = -1;
      started = false;
    }
  };

  $('#tourNext').live('click', function() {
    methods.next();
  });

  $('#tourPrev').live('click', function() {
    methods.prev();
  });

  $('#tourEnd').live('click', function() {
    methods.destroy();
  })

  $.fn.aSimpleTour = function( method )
  {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } 
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } 
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.aSimpleTour' );
    }   
  };

})(jQuery);

// Direct Access
$.aSimpleTour = function(opts) { $.fn.aSimpleTour(opts); }