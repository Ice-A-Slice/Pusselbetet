/*
Author of this document -
Arnar Jóhannsson
*/

var mute_sound = false;
var loop_media;

/*
If you are running the application on a web browser
this if statement will take use of Howler.js to play the sound.
*/
if (typeof Media != 'function') {

  var env = $('body').data('env');
  var Media = function(url, onReady, onError) {
    if (url == '../sound/env/' + env + '.mp3' ){
      var h = new Howl({
        urls: [url],
        volume: 0.5,
        autoplay: false,
        loop: true,
        onend: function() {
        },
        onloaderror: function() {
          onError('Failed to load sound: ' + url);
        }
      });
      return h;
    } else {
      var h = new Howl({
        urls: [url],
        volume: 0.8,
        autoplay: false,
        onend: function() {
          onReady();
        },
        onloaderror: function() {
          onError('Failed to load sound: ' + url);
        }
      });
      return h;
    }
  }
}

/*
  This function loads the sounds when the page loads.
*/
function loadSound(url, loop_boolean){

  var my_media = new Media(
    getAssetPath() + url,
    // success callback
    function () { 
      if(loop_boolean){
        my_media.play();
      }
    },
    // error callback
    function (err) { 
      console.log(err);
    },

    function () {}
    
  );

  // Play audio
  return my_media;
}

/*
  This function gets the path of the audiofile so that
  cordova will find it.
*/
function getAssetPath() {    
    var path = window.location.pathname;
    path = path.substring(0,path.lastIndexOf("/")+ 1);
    return path;
}

//Mute ambience
$('.mute_button').on('click', function(){
  if(mute_sound == false){
    $('.mute_image').attr('src', 'img/icons/icon_mute.png');
    mute_sound = true;
    sounds.ambience.pause();
  }
//Play ambience
else{
  $('.mute_image').attr('src', 'img/icons/icon_sound.png');
  mute_sound = false;
  sounds.ambience.play();
  }
});

/*
  Trigger sounds on click
*/
function clickObjectSound(){
  var env = $("body").data('env');
  var letter_array = [];

  $('.pieces').each(function(){
    letter_array.push($(this).data('letter'));
  }); 

  $('.speak_button').on('click', function(){
    if(env == "alps" && current_letter > 2){
      console.log(current_letter);
      sounds.letters[current_letter+1].play();

    } else{
    sounds.letters[current_letter-1].play();
    }
  }); 

  $('.piece').on('touchstart mousedown', function(){
    sounds.puzzle.grab.play();
  });
  $('.piece').bind('touchend mouseup', function(){
    sounds.puzzle.drop.play();
  });
}

/*
  Plays the next letters sound
*/
function nextLetterSound(current_letter){
  var letter_array = [];
  var env = $("body").data('env');

  $('.pieces').each(function(){
    letter_array.push($(this).data('letter'));
  });
  setTimeout(function(){
    if(env == "alps" && current_letter < 3){
      sounds.letters[current_letter+1].play();

    } 
    else if(env == "alps" && current_letter == 3){
      sounds.letters[current_letter+2].play();
    }
    else if(env == "alps" && current_letter>3){}
    else{
    sounds.letters[current_letter].play();
  }
  }, 1000);
}

/*
  plays letter when puzzle is succeded
*/
function finishPuzzleLetterSound(current_letter){

  var env = $("body").data('env');
  if(env == "alps" && current_letter < 3){
      sounds.letters[current_letter-1].play();
    } 
    else if(env == "alps" && current_letter >= 3){
      sounds.letters[current_letter+1].play();
      console.log(env + current_letter);
    }
    // else if(env == "alps" && current_letter>3){
    //   alert("Kallllleeeeeee");
    // }
    else{
    console.log(env + current_letter);
    sounds.letters[current_letter-1].play();
  }
}

/*
  This function autoplays ambience and the first letter of the page
*/
function firstEnvSounds(){
  // playEnv();
  setTimeout(function(){
    var letter = $(".pieces").first().data('letter');
    var env = $("body").data('env');
    sounds.letters[current_letter-1].play();
    sounds.ambience.play();
  }, 1000);
}

/*
  This function loads the strings containing the specifik worlds letters.
*/
function loadLettersSound(){
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
    loadPageSound(env, enviroments[env]);

}