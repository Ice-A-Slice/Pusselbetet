  //
 // Set the position of the drop-boxes by calling ex: 'setPieces(obj['letters']['M']);'
//
var obj;
var numbers = ['zero','one','two','three','four', 'five','six','seven','eight','nine', 'ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
function getObj(func) {
	$.getJSON("db/letters.json", function(json) {
		if(!obj) {
			obj = json;
			func();
		}
	});
}
function setPieces(json) {
	for (letter in json) {
		var let = obj['letters'][json[letter]];
		for (p in let) {
			$('.pieces:eq(' + letter + ') .targets' + ' .' + p).css({
				position: 'absolute',
				left: (let[p].x - obj['adjust']) * 100 + '%',
				top: (let[p].y - obj['adjust']) * 100 + '%'
			});
			//console.log('X:' + Math.round((let[p].x - obj['adjust']) * 100) + '%' + ' Y:' + Math.round((let[p].y - obj['adjust']) * 100) + '%');
		}
	}
}