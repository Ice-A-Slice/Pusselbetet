var iscroll;
var touchinterval;
var imageposition;

function getLeftPos(obj) {
  var style = window.getComputedStyle($('.sliders').get(0));  // Need the DOM object
  var matrix = new WebKitCSSMatrix(style.webkitTransform);
  return matrix.m41 + obj.offset().left + obj.width() / 2 + ($(window).width() / 3) * obj.index();
}
function getHighlightImage() {
  var closest = $('.slide_highlight img').eq(0);
  var len = $('.slide_highlight img').length;
  var ret = 0;
  var cl_pos = getLeftPos(closest);
  for (var i = 1; i < len; i++) {
    var $this = $('.slide_highlight img').eq(i);
    var this_pos = getLeftPos($this);
    if (Math.abs(this_pos) < Math.abs(cl_pos)) {
      ret = i;
      closest = $this;
      cl_pos = Math.abs(getLeftPos(closest));
    }
  }
  return closest;
}
// function moveSlider(pixels) {
//     $(".sliders").stop().animate({ whyNotToUseANonExistingProperty: pixels }, {
//         step: function(pixels,fx) {
//             $(this).css('-webkit-transform',"translate3d(" + pixels + "px, 0px, 0px)");
//         },
//         duration: 'slow'
//     },'swing');
// }

function moveSlider(pixels) {
  $(".sliders").css({left: pixels});
}

function setSliderWidth() {
  var width_content = 0;
  $('.slide_highlight').children().not('.first').each( function() {
    width_content += $(this).width();
    $(this).css("opacity", 0);
  });
  
  $('.slide_content').css({
    "width": (width_content + $(window).width()/2) + 100,
    "padding-left": ($(window).width() / 4),
    "padding-right": ($(window).width() / 4)
  });

  $('.slide_highlight').css({
    "width": (width_content + $(window).width()/2) + 100,
    "padding-left": ($(window).width() / 4),
    "padding-right": ($(window).width() / 4)
  });
}

var current_letters_seleted = 0;
function setMoveButtons() { //in this case changed to navigate menu using swipes instead of buttons
  console.log('Using touch menu');
  var adjust = parseInt($('.slide_content').css('padding-left'));
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var gnStartX = 0;
    var gnStartY = 0;
    var gnEndX = 0;
    var gnEndY = 0;

    window.addEventListener('touchstart',function(event) {
      gnStartX = event.touches[0].pageX;
      gnStartY = event.touches[0].pageY;
      gnEndX = event.touches[0].pageX;
      gnEndY = event.touches[0].pageY;
      console.log('Start: x,y ' + gnStartX + ',' + gnStartY);
    },false);

    window.addEventListener('touchmove',function(event) {
      gnEndX = event.touches[0].pageX;
      gnEndY = event.touches[0].pageY;
    },false);

    window.addEventListener('touchend',function(event) {
      console.log('Start: x,y ' + gnEndX + ',' + gnEndY);
      // alert('START (' + gnStartX + ', ' + gnStartY + ')   END (' + gnEndX + ', ' + gnEndY + ')');
          if ((gnStartX - gnEndX) > 100) {
          console.log('swiped left');
          if (current_letters_seleted < $('.slide_content > img').length - 1) {
              var $el = $('.slide_content > img').eq(current_letters_seleted);
              var slide_length = $el.position().left + $el.width() / 2 + $el.next().width() / 2 - adjust;
              $('.slide_highlight > img').eq($el.index()).css({opacity: 0})
                  .next().css({opacity: 1});
              slide_length *= -1;
              moveSlider(slide_length);
              current_letters_seleted++;
              console.log(current_letters_seleted);
          }
        } 
        if ((gnStartX - gnEndX) < -100) {
          console.log('swiped right');
          if (current_letters_seleted > 0) {
              var $el = $('.slide_content > img').eq(current_letters_seleted);
              var slide_length = -$el.position().left + $el.width() / 2 + $el.prev().width() / 2 + adjust;
              $('.slide_highlight > img').eq($el.index()).css({opacity: 0})
                  .prev().css({opacity: 1});
              moveSlider(slide_length);
              current_letters_seleted--;
              console.log(current_letters_seleted);
          }
        }
    },false);
  } else {
    $("body")
    .on('mousedown touchstart', function (e) {
      console.log("(x,y) = (" + e.pageX + "," + e.pageY +")");
      xDown = e.pageX;
      yDown = e.originalEvent.touches[0].pageY
      console.log(xDown + ',' + yDown);
    })
    .on('mouseup touchend',function (e) {
      console.log("(x,y) = (" + e.pageX + "," + e.pageY +")");
      xUp = e.pageX;
      yUp = e.pageY;
      console.log(xUp + ',' + yUp);
      if ((xDown-xUp) > 20) {
        console.log('swiped left');
        if (current_letters_seleted < $('.slide_content > img').length - 1) {
            var $el = $('.slide_content > img').eq(current_letters_seleted);
            var slide_length = $el.position().left + $el.width() / 2 + $el.next().width() / 2 - adjust;
            $('.slide_highlight > img').eq($el.index()).fadeTo('slow', 0)
                .next().fadeTo('slow', 1);
            slide_length *= -1;
            moveSlider(slide_length);
            current_letters_seleted++;
        }
      } 
      if ((xDown-xUp) < -20) {
        console.log('swiped right');
        if (current_letters_seleted > 0) {
            var $el = $('.slide_content > img').eq(current_letters_seleted);
            var slide_length = -$el.position().left + $el.width() / 2 + $el.prev().width() / 2 + adjust;
            $('.slide_highlight > img').eq($el.index()).fadeTo('slow', 0)
                .prev().fadeTo('slow', 1);
            moveSlider(slide_length);
            current_letters_seleted--;
        }
      }
    })
  }
  $('.play').on('click tap', function () {
      $('.knapp').eq(current_letters_seleted).css('visibility', 'hidden');
      $('.knapp').eq(current_letters_seleted + $('.knapp').length / 2).trigger('tap');
  });
}

$(document).ready( function() {
    setSliderWidth();
    setMoveButtons();
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false); 

    $('.knapp').on('tap', function() {
        $this = $(this);
        $this.animate({
          'opacity': '0.35'
        }, 240, 'swing')
        .animate({
          'opacity': '1'
        }, 280, 'swing');
        setTimeout(function(){
            $('html').fadeTo('slow', 0);
        }, 500);
        setTimeout(function(){
            window.location.href = $this.data('env') + '.html';
        }, 1600);
        return false;
    });
    $('.sliders').width($('.slide_highlight').width());
})

// ----------------------
//   BUTTONS MENU Start
//
//   OBS! set in document.ready -     addIndexButtons();
// ----------------------
// function addIndexButtons() {
//   console.log('Using button Menu');
//   var items = [];
//   var arrow_image = $('<img />', { src: 'img/icons/arrow_right.png', width: '100' });
//   var triangle = $('<img />', { class: 'triangle' });

//   temp = $('<div>', {
//     class: 'menu_button',
//     id: 'button_back',
//     html: arrow_image[0].outerHTML
//   });
//   items.push(temp);

//   temp = $('<div>', {
//     class: 'menu_button',
//     id: 'play_button',
//     append: triangle
//   });
//   items.push(temp);

//   temp = $('<div>', {
//     class: 'menu_button',
//     id: 'button_forward',
//     html: arrow_image[0].outerHTML
//   });
//   items.push(temp);

//   for (i in items) {
//     $('.sliders').before(items[i]);
//   }
//   setMoveButtons();
// }

// function moveSlider(pixels) {
//     $('.sliders').stop().animate({left: pixels}, 1000);
// }

// var current_letters_seleted = 0;
// function setMoveButtons() {
//     var margin_top = $(window).height() * 0.55 - $('.button_back').height() / 2;
//     var degree = 180;
//     $('#button_back > img').css({
//         'transform':         'rotateY(' + degree + 'deg)',
//         '-o-transform':      'rotateY(' + degree + 'deg)',
//         '-ms-transform':     'rotateY(' + degree + 'deg)',
//         '-moz-transform':    'rotateY(' + degree + 'deg)',
//         '-webkit-transform': 'rotateY(' + degree + 'deg)'
//     });

//     var adjust = parseInt($('.slide_content').css('padding-left'));
//     $('#button_forward').on('click tap', function () {
//         if (current_letters_seleted < $('.slide_content > img').length - 1) {
//             var $el = $('.slide_content > img').eq(current_letters_seleted);
//             var slide_length = $el.position().left + $el.width() / 2 + $el.next().width() / 2 - adjust;
//             $('.slide_highlight > img').eq($el.index()).fadeTo('slow', 0)
//                 .next().fadeTo('slow', 1);
//             slide_length *= -1;
//             moveSlider(slide_length);
//             current_letters_seleted++;
//         }
//     });
//     $('#button_back').on('click tap', function () {
//         if (current_letters_seleted > 0) {
//             var $el = $('.slide_content > img').eq(current_letters_seleted);
//             var slide_length = -$el.position().left + $el.width() / 2 + $el.prev().width() / 2 + adjust;
//             $('.slide_highlight > img').eq($el.index()).fadeTo('slow', 0)
//                 .prev().fadeTo('slow', 1);
//             moveSlider(slide_length);
//             current_letters_seleted--;
//         }
//     });
//     $('#play_button').on('click tap', function () {
//         $('.knapp').eq(current_letters_seleted).css('visibility', 'hidden');
//         $('.knapp').eq(current_letters_seleted + $('.knapp').length / 2).trigger('tap');
//     });
// }
// ----------------------
//   BUTTONS MENU END
// ----------------------