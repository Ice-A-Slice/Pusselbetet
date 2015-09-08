if (typeof Media != 'function') {
  var Media = function(url, onReady, onError) {
    
      console.log('loop');
      var h = new Howl({
        urls: [url],
        volume: 0.5,
        autoplay: false,
        loop: true,
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

function getAssetPath() {    
    var path = window.location.pathname;
    path = path.substring(0,path.lastIndexOf("/")+ 1);
    return path;
}

 function loopAudio(url) {
  // Play the audio file at url
  var url = url;
  var loop_media = new Media(
    getAssetPath() + url,
    // success callback
    function () { 
      console.log(url + " loopAudio():Audio Success"); 
    },
    // error callback
    function (err) { 
      console.log(err);
    },
    loop
  );
  // onStatus Callback 
  function loop(status) {
    console.log("inside loop");
    if (status === Media.MEDIA_STOPPED) {
      console.log("media stopped");
      loop_media.play();
    }
  } 

  loop_media.play();

  // Play audio
  
  // Pause after 10 seconds
};


    setTimeout(function(){
      loopAudio('sound/env/index.mp3');
    }, 1000);




