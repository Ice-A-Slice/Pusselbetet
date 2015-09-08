// CONSUMING PARRENT PUZZLE
function pepLetterPieces() {
  $('.pieces').children('.piece').each( function() {
    var $this = $(this);
    $this.pep({
      cssEaseDuration: 250,
      droppable: '.drop-target.' + $(this).data("target"),
      overlapFunction: function($a, $b){
        var rect1 = $a[0].getBoundingClientRect();
        var rect2 = $b[0].getElementsByClassName('drop-box')[0].getBoundingClientRect();
        var add = 40;
        return ( rect2.left > rect1.left - add && 
              rect2.right   < rect1.right + add && 
              rect2.top     > rect1.top - add && 
              rect2.bottom  < rect1.bottom + add );
      },
      velocityMultiplier: 1.5,
      useCSSTranslation: false,
      start: function(ev, obj) {
        obj.noCenter = false; 
        $('.piece').not($this).each(function() {
          if (parseInt($(this).css('z-index')) === 10) {
            $(this).addClass('unfocused');
          }
        });
      },
      drag: function(ev, obj) {
        var vel = obj.velocity();
        var rot = (vel.x)/5;
        rotate(obj.$el, rot)
      },
      stop: function(ev, obj) {
        rotate(obj.$el, 0);
        $('.piece').each(function() {
          $(this).removeClass('unfocused');
        });
      },
      rest: handleCentering,
      constrainTo: [
        -$(window).height() * 0.1,
        ($(window).width() / 2 + $this.parent().find('.letter_frame').width() / 2 - $this.width() / 2),
        $(window).height() * 0.9 - $this.height() / 2 - 10,
        -($(window).width() / 2 - $this.parent().find('.letter_frame').width() / 2)
      ]
    });
  });
}
 
function handleCentering(ev, obj){
  if ( obj.activeDropRegions.length > 0 ) { 
    centerWithin(obj);
  }   
}

function centerWithin(obj){
  var $parent = obj.activeDropRegions[0];
  var pTop    = $parent.position().top;
  var pLeft   = $parent.position().left;
  var pHeight = $parent.outerHeight();
  var pWidth  = $parent.outerWidth();

  var oTop    = obj.$el.position().top;
  var oLeft   = obj.$el.position().left;
  var oHeight = obj.$el.outerHeight();
  var oWidth  = obj.$el.outerWidth();

  var cTop    = pTop + (pHeight / 2);
  var cLeft   = pLeft + (pWidth / 2);

  if ( !obj.noCenter ) {
    if ( !obj.shouldUseCSSTranslation() ) {
      var moveTop = cTop - (oHeight/2);
      var moveLeft = cLeft - (oWidth/2);
      
      obj.$el.animate({ top: moveTop, left: moveLeft }, 50);
    } else{
      var moveTop   = (cTop - oTop) - oHeight/2;
      var moveLeft  = (cLeft - oLeft) - oWidth/2;
      obj.moveToUsingTransforms( moveTop, moveLeft );
    }
    $.pep.unbind(obj.$el);
    $(obj.$el).css("z-index", 9);
    sounds.puzzle.correct.play();
    puzzleCompletion();
    obj.noCenter = true;
    return;
  }

  obj.noCenter = false;
}

function rotate($obj, deg){
  $obj.css({ 
      "-webkit-transform": "rotate("+ deg/2 +"deg)",
         "-moz-transform": "rotate("+ deg/2 +"deg)",
          "-ms-transform": "rotate("+ deg/2 +"deg)",
           "-o-transform": "rotate("+ deg/2 +"deg)",
              "transform": "rotate("+ deg/2 +"deg)" 
    }); 
}
var current_letter = 1; // current puzzle
var completed_pieces = 0; //keeps track of puzzlepieces placed on its correct spot

// Check for puzzle completion
function puzzleCompletion(){
    completed_pieces++;
    if (completed_pieces == ($('.pieces:eq(' + (current_letter - 1) +') > div').length - 1)) {  
      console.log("PUZZLE COMPLETE! :D");
      replayGif();
      showArrow();
      //successanimation end
      sounds.puzzle.finish.play();
      finishPuzzleLetterSound(current_letter);
      completed_pieces = 0;
    };
}
function showArrow() {
  $('.next').show()
    .animate({
      opacity: 1
    }, 400)
    .bind('click ontouchstart', function() {
      clickedNext();
    });
}