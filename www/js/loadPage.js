function urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}
function getPiecesCount(letter_arr) {
	var pieces_count = 0;
	for (var i = 0; i < letter_arr.length; i++) {
		for (p in obj['letters'][letter_arr[i]]) {
			if (p !== 'attr') {
				pieces_count++;
			}
		}
	}
	return pieces_count;
}

//använd in för att gå ignom obejkt och sen for loop för arrayer
var sounds = {};
function loadPageSound(env, sound_arr)  {
	
	var sound_count = sound_arr.length;
	var sound_folder = 'sound/letters/';
	var file_format = '.mp3';
	var ambience_folder = "sound/env/";
	var puzzle_folder = "sound/puzzle/";
	var letter_sounds = [];
	var ambience_url;
	var ambience;
	var puzzle = {
		grab: 		loadSound( puzzle_folder + 'grab_two' + file_format, false),
		drop: 		loadSound( puzzle_folder + 'drop' + file_format, false),
		correct: 	loadSound( puzzle_folder + 'correct' + file_format, false),
		finish: 	loadSound( puzzle_folder + 'finish_puzzle' + file_format, false)
	};
	
	// 
	for (var name in sound_arr) {
		var arr = sound_arr[name];
	   	var len = arr.length;
	   	
	   	// loop thru array and load letter sounds
	   	for (var i = 0; i < len; i++){
	   		var sound_string = sound_folder + arr + file_format;
	   		letter_sounds.push(loadSound(sound_string, false));
	   	}

	}

	// load ambience sound
	ambience_url = ambience_folder + env + file_format;
	ambience = loadSound(ambience_url, true);

	// push sounds to sounds object
	sounds.letters = letter_sounds;
	sounds.ambience = ambience;
	sounds.puzzle = puzzle;
}

function showLoadGif() {
	if ($('.fade_cover img').length < 1) {
		$('.fade_cover').append($('<img />', {
			src: 'img/menu/loading.gif',
			onload: function() {
				$(this).css('left', $(window).width() / 2 - ($(window).width() * 0.1) / 2);
			}
		}));
	} else {
		$('.fade_cover img').show();
	}
}
function hideLoadGif() {
	$('.fade_cover img').hide();
}

function loadPage(env, letter_arr, readyFunction) {
	showLoadGif();
	getObj( function(){
		var letter_count = letter_arr.length;
		var loaded_images = 0;
		for (var i = 0; i < letter_count; i++) {

			var items = [];
			var letter = letter_arr[i];
			var image_folder = 'img/' + env + '/puzzle/' + letter + '/';
			var frame_image = $('<img />',{
				'src': image_folder + letter.toLowerCase() + '_box.png',
				'class': 'letter_frame'
			});
			items.push(frame_image[0].outerHTML);
			var count = 0;
			for (p in obj['letters'][letter]) {
				if (p !== 'attr') {
					count++;
					var piece = $('<div />', {
						'class': 'piece pep ' + numbers[count], // ex: numbers[2] returns 'two'
						'data-target': numbers[count],
						append: $('<img/>', { src: image_folder + letter.toLowerCase() + '_' + count + '.png' }),
						onload: function() { loaded_images++; }
					});
					items.push(piece[0].outerHTML);
				}
			}
			var targets = (function(index) {
				var drops = [];
				var p_count = getPiecesCount([letter_arr[index]]);
				for (var i = 0; i < p_count; i++) {
					drops.push($('<div class="drop-target ' + numbers[drops.length + 1] + '" />')[0].outerHTML);	
				}
				return $('<div/>', {
					'class': 'targets',
					'html': drops.join('')
				})[0].outerHTML;
			})(i);
			items.push(targets);

			$('<div/>', {
				'class': 'pieces demo droppable-consuming-parent',
				'html': items.join(''),
				'data-letter': letter
			}).appendTo('body');
		}
		$('.between div').each(function(index) {
			var between_image_url = 'img/' + env + '/env/between_' + (index + 1) + '.png';
			$this = $(this);
			if (urlExists(between_image_url)) {
				var image_width = $(window).height() * ($this.data('size') / 100);
				$this.css({
					left: $(window).width() * (index + 1) + 1000 * index,
					width: '1000px'
				}).append( $('<img />', {
					src: between_image_url,
					width: image_width,
					css: {
						left: ($this.width() / 2 - image_width / 2) + 'px',
						position: 'absolute',
						bottom: $this.data('bottom') + 'px'
					}
				}));
			} else {
				$this.css('width', '1000px');
			}
		});
		$('<img />', {
			class: 'medal',
			src: 'img/medals/' + env + '.png'
		}).appendTo('body');
		// Wait for every image pieces images to load before running readyFunction();
		var imageInterval = setInterval( function() {

			if (loaded_images === getPiecesCount(letter_arr)) {
				hideLoadGif();
				readyFunction();
				clearInterval(imageInterval);
				return false;
			}
		}, 1000);
	});
}