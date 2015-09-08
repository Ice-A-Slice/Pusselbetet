//$(document).bind('keydown', 'ctrl+s', function(){saveJSON(obj); return false;});

  //
 // Messageholder
//
var timeout;
// Sets the color of the messageholder.
function setMessageColor(col) {
	$("#messageholder").css('background-color', col);
}
// Shows the messageholder with a text.
function showMessage(text, type) {
	clearTimeout(timeout);
	$("#messageholder").stop()
			.html(text)
			.css({"top": '0', opacity: '0'});
	// If type is not undefined set it as the parameter, otherwise set it to 'normal'.
	type = typeof type !== 'undefined' ? type : 'normal';
	switch(type) {
		case 'normal': 	setMessageColor("#eee"); break;
		case 'warning':	setMessageColor("#F99"); break;
		case 'success': setMessageColor("#9F9"); break;
		default: 		setMessageColor("#eee"); break;
	}
	// Animations!
	$("#messageholder").animate({"top": '20', opacity: '1'}, 600, function() {
		timeout = setTimeout(function(){
			$("#messageholder").animate({"top": '0', opacity: '0'}, 600);
		}, 4000);
	});
}

  //
 // JSON
//
var obj;
// Gets the letters-information from the file 'letters.json' and initiates 'jsonReady()'.
$.getJSON("letters.json", function(json) {
	obj = json;
	jsonReady(obj['letters']);
});
// Returns the value of the h2-tag for every li
jQuery.fn.getLetter = function() {
	return $(this).closest('li').find('h2').clone().children().remove().end().text();
}
// Makes a lists of tables with the position of every letter.
function jsonReady(data){
	var attr;
	// Every part of each letter's name is a number in 'word-format',
	var numbers = ['zero','one','two','three','four', 'five','six','seven','eight','nine', 'ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
	var items = [];
	// For each letter, make a table with the part's 'x' and 'y' positions.
	$.each( data, function(key, val) {
		var li = '<li><h2>' + key + "<span>&#x25BC;</span></h2>\n<ul>\n";
		li += "<table class='table table-striped table-bordered table-condensed'>";
		li += "<tr><th>Namn</th><th class='text-right'>width</th><th class='text-right'>height</th><th></th>";
		li += "<tr><td>attr</td><td><input class='text-right'value='" + val['attr']['width'] + "'/></td><td><input class='text-right' value='" + val.attr.height + "'/></td><td><div class='btn'><div class='glyphicon glyphicon-fullscreen'></div></div>";
		li += "</table>";

		li += "<table class='table table-striped table-bordered table-condensed'>";
		li += "<tr><th>Namn</th><th class='text-right'>X</th><th class='text-right'>Y</th><th></th>";
		// For each part, make a table-row with the 'x' and 'y' positions.
		for (l in val) {
			if (l != "attr") {
				li += '<tr><td>' + l +'</td><td><input class="pos" value="' + (val[l]['x'] * val.attr.width).toFixed(2) + '"></td>';
				li += '<td><input class="pos" value="' + (val[l]['y'] * val.attr.height).toFixed(2) + '"></td>';
				li += '<td><div class="btn btn-danger remove_row"><div class="glyphicon glyphicon-trash"></div></div></td></tr>';	
			}
		}
		li += "</table>"
		li += '<hr /><button type="button" class="add_row btn btn-success btn-small"><span class="glyphicon glyphicon-plus"></span> Lägg till del</button><hr />';
		li += '</ul></li>';
		items.push(li);
	});
	// Append the table to the ul.
	$( "<ul/>", {
		"id": "letterlist",
		html: items.join("")
	}).appendTo('#wrapper');
	// Make the li's toggable.
	$(document).on('click', "li > h2", function() {
		$(this).parent().children('ul').slideToggle();
	});
	// Adds a row to the table and an object to the 'obj'-variable for the respective letter.
	$(document).on("click", ".add_row", function(){
		var t = $(this).prev().prev();
		var nmr = numbers[t.find('tbody').children().length];
		t.append('<tr><td>' + nmr +'</td><td><input class="pos" value="0.00"></td><td><input class="pos" value="0.00"></td><td><div class="btn btn-danger remove_row"><div class="glyphicon glyphicon-trash"></div></div></td></tr>');
		var character = $(this).parent().siblings('h2').clone().children().remove().end().text();
		console.log($(this).getLetter());
		obj['letters'][character][nmr] = { x: (0 / data[$(this).getLetter()]['attr']['width']), y: (0 / data[$(this).getLetter()]['attr']['height']) };
		saveJSON(obj);
	});
	// Removes a row to the table and an object from the 'obj'-variable for the respective letter.
	$(document).on("click", ".remove_row", function () {
		if($(this).closest('tr').siblings().length < 2) {
			showMessage('Det måste alltid finnas en del eller mer på varje bokstav.', 'warning');
		} else {
			var r = confirm("Är du säker på att du vill ta bort den?");
			if (r == true){
				var index = $(this).closest('tr').index();
				var siblingcount = $(this).closest('tr').siblings().length;
				var t = $(this).closest('table');
				var character = $(this).getLetter();
				for(var i = index; i < siblingcount; i++) {
					t.find('td:first-child').eq(i).html(numbers[i]);
					obj['letters'][character][numbers[i]]['x'] = obj['letters'][character][numbers[i+1]]['x'];
					obj['letters'][character][numbers[i]]['y'] = obj['letters'][character][numbers[i+1]]['y'];
				}
				var count = 0;
				for (c in obj['letters'][character]) {
					if (c != 'attr') {
						count++;
					}
				}
				delete obj['letters'][character][numbers[count]];
				saveJSON(obj);
				$(this).closest('tr').remove();
			}
		}
	});
	// Save on every change on every inout-field.
	$(document).on("change", "input", function(){
		if (isNumber(this.value)) {
			var val = parseFloat(this.value);
			$td = $(this).closest('td');
			var x_or_y = $td.closest('table').find('th').eq($td.index()).text().toLowerCase();
			var character = $(this).getLetter();
			if (x_or_y == 'x' || x_or_y == 'y') {
				var numb = $td.closest('tr').find('td').eq(0).html();
				var direction = x_or_y == 'x' ? 'width' : 'height';
				obj['letters'][character][numb][x_or_y] = val / obj['letters'][character]['attr'][direction];
			} else if (x_or_y == 'width' || x_or_y == 'height') {
				obj['letters'][character]['attr'][x_or_y] = val;
				var counter = 1;
				for (p in obj['letters'][character]) {
					if (p != 'attr') {
						var pval = obj['letters'][character][p];						
						if (x_or_y == 'width') {
							var input = $td.closest('li').find("td:contains('" + numbers[counter] + "')").next().find('input');
							pval.x = input.val() / val;
						} else {
							var input = $td.closest('li').find("td:contains('" + numbers[counter] + "')").next().next().find('input');
							pval.y = input.val() / val;
						}

						counter++;
					}
				}
			}
			saveJSON(obj);
		} else {
			showMessage('Du har inte skrivit ett nummer! (Punkt, inte komma.)', 'warning');
		}
		
	});
}
// Checks i the parameter is a number and returns 'true' if so.
function isNumber(n) {
	var intRegex = /^\d+$/;
	var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
	return intRegex.test(n) || floatRegex.test(n)
}
// Sends data to save.php to save the data
function saveJSON(d) {
	$.ajax({
		type: "POST",
		url: "save.php",
		data: d,
		success: function(msg){
			showMessage('Sparat!', 'success');
		}
	});
}