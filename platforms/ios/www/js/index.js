/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
$(document).ready(function() {
  loadBody();
});

var comp;
window.AdobeEdge = window.AdobeEdge || {};
function loadBody() {
  var env = getEnviroment();
  var enviroments = {
    'index':   [],
    'savanna': ['A', 'B', 'C', 'D'],
    'woods':   ['E', 'F', 'G', 'H'],
    'ice':     ['I', 'J', 'K', 'L'],
    'jungle':  ['M', 'N', 'O', 'P'],
    'desert':  ['Q', 'R', 'S', 'T'],
    'beach':   ['U', 'V', 'W', 'X', 'Y'],
    'alps':    ['Z', 'AO','AE','OE']
  }
  if (typeof enviroments[env] === 'undefined') {
    console.log('Error: there\'s no enviroment called "' + env + '"');
    return false;
  }
  if (getEnviroment() !== 'index') {
    loadPage(env, enviroments[env], function() {
      var charArr = [];
      $('.pieces').each(function(){
        charArr.push($(this).data('letter'));
      });
      $(document).bind('.next', 'click tap', function() {
        console.log('majs');
        clickedNext();
      });
      $('.home_button').bind('click tap', function() {
        $('.fade_cover').animate({
          opacity: 1
        }, 1800, 'swing');
        setTimeout( function(){
          window.location.href = "index.html";
        },1600);
      });
      preventScrolling();
      setPieces(charArr);
      pepLetterPieces();
      hideExplosionOnPageLoad();
      setWorld();
      loadLettersSound();
      firstEnvSounds();
      clickObjectSound();
      whiteFadeCover();
      parallax();
      setArrowPosition();
      successExplotionPos();


    });
  }else {
    // Load index's JS- and/or CSS-files here.
    var files = [
      'js/menu.js'
    ];
    loadJavaScripts(files);
    whiteFadeCover();
    setTimeout( function() {
      $('.slider').width($('.slider').width() + 300);
      $('.sliders').width($('.sliders').width() + 300);
    }, 1000);
  }
}

function whiteFadeCover() {
    //white fading effect
    $('.fade_cover').css({
      width: $('body').width() + 'px'
    }).animate({
      opacity: 0
    }, 1800, 'swing');
}

function successExplotionPos() {
  $('.explosion_div').css('left', ($(window).width()/2 - ($('.explosion_div').width()/2)) + 'px');
}

function hideExplosionOnPageLoad() {
  $('.explosion_div').css({opacity: 0});
  setTimeout(function(){
    $('.explosion_div').css({opacity: 1});
  }, 2000);

}

function replayGif(){
   var img = new Image();
   img.src = 'img/explo.gif';

   $('.explosion_div').css('background-image', 'url("' + img.src + '?x=' + Date.now() + '")' );
   console.log("replay!!");
}

function setArrowPosition() {
  $('.next').css('left', ($(window).width() - ($('.next').width() + 60)) + 'px');
}

function preventScrolling() {
  document.addEventListener('touchmove', function(e) { 
    e.preventDefault(); 
  }, false);
}
// document.body.addEventListener('touchstart', function(e){ 
//   e.preventDefault(); 
// });

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function getPositionOfLetterFrameWithIndex(c_letter) {
  $lf = $('.letter_frame').eq(c_letter);
  console.log($lf);
  // If there is another letter
  var left;
  if ($lf.length != 0) {
    left = $lf.offset().left - ($(window).width() / 2 -  $lf.width() / 2);
  } else {
    left = $(document).width() - $(window).width();
  }

  return left;
}

function scrollBodyTo(scroll) {
  // if (typeof bodyScroll === 'undefined' || !bodyScroll)
  //   $('html, body').animate({scrollLeft: scroll}, 2500, 'easeInOutCubic');
  // else
  //   bodyScroll.scrollTo(-scroll, 0, 2500, IScroll.utils.ease.circular);
  $('html, body').animate({scrollLeft: scroll}, 2500, 'easeInOutCubic');
}

// Animation relocating the user to next letter
function clickedNext() {
    $('.next').unbind('click');
    var scroll = getPositionOfLetterFrameWithIndex(current_letter);
    scrollBodyTo(scroll);
    $('.next').animate({
      left: "+=4%"
    }, 200, 'swing');
    $('.next').animate({
      left: getPositionOfLetterFrameWithIndex(current_letter) + $(window).width() - 245,
      opacity: -3
    }, 400, 'easeInBack');
    if (current_letter != $('.pieces').length) {
      $('.explosion_div').css('left', "+=" + ($(window).width() + 1000));
    };
    if (current_letter == $('.pieces').length) {
      medallionAnimation();
      setTimeout(function(){
        $('html').fadeTo("slow", 0);
      }, 5000);
      setTimeout(function(){
        window.location.href = "index.html";
      }, 6000);
    };
    // setTimeout(function(){
    //   $('.next').fadeTo("slow", 1);
    // }, 2000);
    nextLetterSound(current_letter);
    current_letter++
    return false;
}; 

function medallionAnimation() {
  $('.medal').css({'top': -($(window).height()), 'left': $(document).width() - $(window).width() / 2});
  setTimeout(function() {
    $('.medal').animate({top: $(window).height() * 0.25}, 1000, 'easeOutBounce', function() {
      $(this).animate({})
    });
  },2000);
}

//--------------------------------
// SCROLL LEFT ON COMPLETION END
//--------------------------------

function setWorld() {
  var p_count = $('.pieces').length;
  var body_width = ((p_count + 1) * $(window).width()) + ((p_count - 1) * 1000);
  $('.backgrounds > div').css({
    'width': body_width
  });
  $('.pieces').each( function(i) {
    var $this = $(this);
    $this.center(i + 1, 1000);
    var letter_image_width = obj['letters'][$this.data('letter')]['attr'].width;
    var letter_image_height = obj['letters'][$this.data('letter')]['attr'].height;
    var piecescount = $this.children('.piece').length;
    $this.children('.piece').each( function() {
      var $this = $(this);
      var index = $this.index();
      $this.find('img').width($this.find('img').width() * ($this.siblings('.letter_frame').width() / letter_image_width));
      var rnd = [-($(window).width() / 2 - $this.width() * 2), $(window).width() / 2];
      add = Math.floor(Math.random() * rnd[1]) + rnd[0];
      $this.css({
        width: $this.find('img').width() + 'px',
        height: $this.find('img').height() + 'px',
        top: $this.parent().height() - $(this).find('img').height() + $(window).height() * 0.2 + 'px',
        left: add + 'px'
      }).append($('<div />',{
        class: 'drop-box drop-box_' + index
      }));
    });
    $this.width((letter_image_width) * ($this.find('.letter_frame').width() / letter_image_width));
  });
};

