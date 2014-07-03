/**
 * 
 */
var ROUNDS = 4;
var MAX_GAMES = 10;
var DIFFICULTIES = 5;
var GAME_NAMES = ["Matching",'1','2','3','4','5','6','7','8','9'];
var person;
var calibrated = false;
var favorite = "dog";
var cols;// game 0?
var game;
var dif = new Array(MAX_GAMES);// difficulty for the games
var scores;//[game][dificulty][20 rounds]
var round;
var answer;
var correct;


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameLoad() {

	if (game == 0) {
		
		var div2;
		$("#0").show();
		var cols2 = document.getElementById('columns');
		cols2.innerHTML = '';
		var ran = getRandomInt(1, dif[0] + 3);
		var filenum = -1;
		var temp = -1;
		for (var i = 1; i <= dif[0] + 3; i++) {
			var innerDiv = document.createElement('div');

			var innerHead = document.createElement('header');

			while (filenum == temp) {
				temp = getRandomInt(1, 448); // mathicng count

			}
		
			filenum = temp;

			var img = document.createElement("img");
			img.src = "img/" + filenum + "_test.gif";

			innerHead.innerHTML = filenum;

			img.setAttribute("height", "100");
			img.setAttribute("width", "100");

			innerDiv.appendChild(innerHead);
			innerDiv.appendChild(img);

			innerDiv.setAttribute('class', 'column');
			$(innerDiv).draggable();
			cols2.appendChild(innerDiv);
			if (i == ran) {
				answer = "img/" + filenum + "_test.gif";
				div2 = innerDiv.cloneNode(true);
				document.getElementById('head').innerHTML = '';
				document.getElementById('head').appendChild(div2);

			}

		}

		cols = document.getElementsByClassName('column');

		[].forEach.call(cols, function(col) {
	
			
			$(col).on('dragstop', function(e) {
				handleDrop(e, col, div2);
				
			});

		});
		$("img").on("dragstart", function(e) {
			
			e.preventDefault();
		});
	}

	if (game == 2) {
		alert(2 + 'test');
	}

}



window.onunload = function() {
	if(dif[0] != null){
		storePerson();
	}
};

window.onload = function() {
	var x = new Array(MAX_GAMES);
	for (var i = 0; i < MAX_GAMES; i++) {
		x[i] = new Array(DIFFICULTIES);

		for (var j = 0; j < DIFFICULTIES; j++) {

			x[i][j] = new Array();

		}

	}
	$("h1").draggableTouch();
	scores = x;

	person = localStorage.getItem("last_user");
	
	populatePeople();

	// Account Select
	$("#stats").hide();
	$("#calibrate").hide();
	$("#0").hide();
	$("#replay").hide();
	$("#main").hide();
	$('#startButton').click(clickStart);
	$("#newPerson").click(createPerson);
	$("#0").hide();
	$("#games").hide();
	$("#gameSel").click(function() {
		$("#main").hide();
		$("#games").show();

	});
	$("#matchingButton").click(function() {
		$("#games").hide();
		newGame(0);

	});
	$("#playAgain").click(function() {
		$("#replay").hide();
		newGame(game);

	});
	$("#back").click(function() {
		$("#replay").hide();
		$("#main").show();

	});
	$("#backMenu").click(function() {
		$("#games").hide();
		$("#main").show();

	});	$("#backMenu2").click(function() {
		$("#stats").hide();
		$("#main").show();

	});
	$("#out").click(function() {
		$("#main").hide();
		populatePeople();
		$("#start").show();

	});	
	$("#statsButton").click(function() {
		$("#main").hide();
		stats();
		$("#stats").show();
		

	});
	$("#backGame").click(function() {
		$('#' + game).hide();
		$("#games").show();

	});

};

function populatePeople() {
	$("#selectName").empty();
	var all = localStorage.getItem("people");
	if (all != null) {

		$("#selectName").prop("disabled", false);

		var all_sp = all.split('--');
		for (var i = 0; i < all_sp.length; i++) {
			if (all_sp[i] != '') {
				$("#selectName").append(
						"<option value=\"" + all_sp[i] + "\">" + all_sp[i]
								+ "</option>");
			
			}
		}
	
		$("#selectName option[value="+person + "]").attr('selected', 'selected');

	} else {

		$("#selectName").prop("disabled", true);

	}
}

function newGame(g) {

	if (!calibrated) {

		$("#calibrate").show();

		var options = $("#calibrate").children();

		for (var i = 1; i <= options.length; i++) {

			$(options[i]).click(function() {

				favorite = $(options[i]).html();

				calibrated = true;
				$('#calibrate').hide();
				newGame(g);

			});

		}

	} else {

		round = 1;
		correct = 0;
		game = g;
		gameLoad();

	}
}

function clickStart() {

	person = $('#selectName option:selected').attr('value');

	if (!person) {
		return;
	}
	$("#name").val("");
	loadPerson();

	$("#start").hide();
	$("#main").show();

}

function createPerson() {
	person = $("#name").val();
	$("#name").val("");
	var all = localStorage.getItem("people");
	if (all == null) {
		all = '';
	}

	var all_sp = all.split('--');
	if (person == '' | -1 != $.inArray(person, all_sp)) {

		alert("already exists");
		return;
	}

	localStorage.setItem("people", all + "--" + person);

	for (var i = 0; i < MAX_GAMES; i++) {

		dif[i] = 0;

	}

	var x = new Array(MAX_GAMES);
	for (var i = 0; i < MAX_GAMES; i++) {
		x[i] = new Array(DIFFICULTIES);

		for (var j = 0; j < DIFFICULTIES; j++) {

			x[i][j] = new Array(20);

			for (var h = 0; h < 20; h++) {

				x[i][j][h] = 'B-0-0-0';
			}

		}

	}

	scores = x;

	// localStorage.setItem(person + "scores", scores2);

	storePerson();
	$("#start").hide();
	$("#main").show();

}

function storePerson() {
	
	localStorage.setItem(person + "difficulty", JSON.stringify(dif));


	localStorage.setItem(person + "scores", JSON.stringify(scores));
	localStorage.setItem(person + "fav", favorite);
}

function loadPerson() {
	calibrated = false;
	localStorage.setItem("last_user", person);
	favorite = localStorage.getItem(person + "fav");
	dif = JSON.parse(localStorage.getItem(person + "difficulty"));// 1 number per	
	scores = JSON.parse(localStorage.getItem(person + "scores"));// 20


}
function collision($div1, $div2) {
	var x1 = $div1.offset().left;
	var y1 = $div1.offset().top;
	var h1 = $div1.outerHeight(false);
	var w1 = $div1.outerWidth(false);
	var b1 = y1 + h1;
	var r1 = x1 + w1;
	var x2 = $div2.offset().left;
	var y2 = $div2.offset().top;
	var h2 = $div2.outerHeight(false);
	var w2 = $div2.outerWidth(false);
	var b2 = y2 + h2;
	var r2 = x2 + w2;

	if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2)
		return false;
	return true;
}

function handleDrop(e2, div1, div2) {

	var e = e2.originalEvent;
	e.stopPropagation(); // Stops some browsers from redirecting.
	e.preventDefault();

	switch (game) {
	case 0:
		if (!collision($(div1), $(div2)))
			return;
		// Don't do anything if dropping the same column we're dragging.
		if (div1 != div2) {

			if (div1.firstChild.innerHTML == div2.firstChild.innerHTML) {// drag
				// //change
				// this
				// at
				// some
				// point
				// if
				// needed

				if (!playing) {
					correct++;
				}
				
					
				
					playing = false;
					$("#columns .column").draggable("disable");
					$(div1).remove();
					$(div2).fadeOut(500);
					$(div2).fadeIn(1500);
					// you win animation
					if (round != ROUNDS) {
					
						window.setTimeout(gameLoad, 2000);
						round++;
					} else {
						round = 0;

						window.setTimeout(saveScore, 2000);
					}

			
				
					
				
			} else {
				alert('wrong');
				div1.setAttribute("class", 'wrong');
				cols = document.getElementsByClassName('column');

				[].forEach.call(cols, function(col) {

					if ($(col).children('img').attr('src') == answer
							& col != div2) {
						playing = true;
						loop($(col));

					}

				});
			}

		}
		break;
	case 2:

		break;

	}

}

function saveScore() {
	
	$('#' + game).hide();
	$("#replay").show();
	var d = new Date();

	var date = "-" + (d.getMonth() + 1) + "-" + d.getUTCDate() + "-"
			+ d.getFullYear();

	var cor;
	if (correct == 10) {
		cor = "A";
	} else {
		cor = correct + '';
	}

	var score = cor + date;

	scores[game][dif[game]].push(score);// newest at 19
	if (scores[game][dif[game]].length > 20) {
		scores[game][dif[game]].shift();
	}

	if (correct > ROUNDS - 1 && dif[game] < DIFFICULTIES - 1) {
		dif[game]++;

	}
	correct = 0;
	storePerson();
}

var playing = false;


function stats() {
	var table = $('#stats table');
	table.empty();
	for (var i = 0; i < MAX_GAMES + 1; i++) {
		table.append("<tr> </tr>");
		
	}
	var tr0 = $("tr").get(0);
	$(tr0).append("<td>Dificulty</td>");
	for (var x = 1; x <= DIFFICULTIES; x++){
		$(tr0).append("<td>Level" + x + "</td>");
	}
	
	
	for (var j = 0; j < MAX_GAMES; j++) {
		var tr = $("tr").get(j + 1);
		$(tr).append("<td>"+GAME_NAMES[j]+"</td>");
		for (var y = 0; y < DIFFICULTIES; y++){
		$(tr).append("<td class = \'score\'>"+scores[j][y][19].replace("A", "10").replace("B-0-0-0", "NONE") +"</td>");

		
		}
		
		
	}
	
	
	
	var all_rows = $(".score");
	
	var funcs = [];
	function setupScoreStat(i, x) {
		
		return function () {
			var all = "";
			for (var j = 19; j >= 0; j--) {
				all = all + (scores[i][x][j].replace("A", "10") + "\n").replace("B-0-0-0\n", "");
			}
			if (all == "") {
				all = "No games played";
			}
			alert("Last 20 games\n" + all);
		};
		
	}
	
	for (var i = 0; i < MAX_GAMES; i++) {

		for (var x = 0; x < DIFFICULTIES; x++){
			//alert(scores[9][4][19]);
			funcs[i*DIFFICULTIES + x] = setupScoreStat(i , x);
			
			
			$(all_rows[i*DIFFICULTIES + x]).click(setupScoreStat(i,x));
			
		}
	}
		

}




function loop(e) {

	if (playing) {
		e.fadeTo(700, .3, function() {
			e.fadeTo(700, 1, loop(e));
		});
	}
}
