/**
 * 
 */
var height;
var width;
var cols;
var images = new Array();
var imagesloc = new Array();
var game;
function gameLoad() {

	if (game == 1) {

		document.getElementById('columns').style.display = "initial";
		var cols2 = document.getElementById('columns');
		cols2.innerHTML = '';
		for (var i = 0; i < 14; i++) {
			var innerDiv = document.createElement('div');
			innerDiv.setAttribute('class', 'column');
			innerDiv.setAttribute('draggable', 'true');
			var innerHead = document.createElement('header');
			innerHead.innerHTML = i + 1;

			var img = document.createElement("img");
			img.src = "images/car.png"; 
			img.setAttribute("height", "100");
			img.setAttribute("width", "100");

			innerDiv.appendChild(innerHead);
			innerDiv.appendChild(img);
			cols2.appendChild(innerDiv);

			document.getElementById("mainCanvas").style.display = "none";
		}

		cols = document.getElementsByClassName('column');

		[].forEach.call(cols, function(col) {
			col.addEventListener('dragstart', handleDragStart, false);
			col.addEventListener('dragenter', handleDragEnter, false);
			col.addEventListener('dragover', handleDragOver, false);
			col.addEventListener('dragleave', handleDragLeave, false);
			col.addEventListener('drop', handleDrop, false);
			col.addEventListener('dragend', handleDragEnd, false);

		});

	}

	if (game == 2) {
		alert(2 + 'test');
	}

}

window.onload = function() {

	height = 200;
	width = document.body.clientWidth * .9;

	var c = document.getElementById("mainCanvas").getContext("2d");
	var c2 = document.getElementById("mainCanvas");
	c2.setAttribute('width', width);
	c2.setAttribute('height', height);
	c.strokeStyle = '#ff0000';
	images[0] = new Image();
	images[0].src = "images/car.png";

	images[0].onload = function() {
		c.drawImage(images[0], width / 8, height / 8, images[0].width / 4,
				images[0].height / 4);
		c.strokeRect(width / 8, height / 8, images[0].width / 4,
				images[0].height / 4);
		window.addEventListener('click', click);
		imagesloc[0] = {
			max_x : width / 8 + images[0].width / 4,
			max_y : height / 8 + images[0].height / 4,
			min_x : width / 8,
			min_y : height / 8
		};
	};

	images[1] = new Image();
	images[1].src = "images/car.png";

	images[1].onload = function() {
		c.drawImage(images[1], 2 * width / 8, 2 * height / 8,
				images[1].width / 4, images[1].height / 4);
		c.strokeRect(2 * width / 8, 2 * height / 8, images[1].width / 4,
				images[1].height / 4);
		window.addEventListener('click', click);
		imagesloc[1] = {
			max_x : 2 * width / 8 + images[1].width / 4,
			max_y : 2 * height / 8 + images[1].height / 4,
			min_x : 2 * width / 8,
			min_y : 2 * height / 8
		};
	};
};

function click(e) {
	var c = document.getElementById("mainCanvas");

	var temp = hasPosition(imagesloc, c, e);

	// c.getContext("2d").fillRect(width/8, height/8, images[temp].width/4,
	// images[temp].height/4);

	game = temp;
	gameLoad();

}
function hasPosition(imagesloc, canvas, e) {

	for (var i = 0; i < imagesloc.length; i++) {
		var z = cPos(canvas, e);

		if (z.x < imagesloc[i].max_x && z.x > imagesloc[i].min_x
				&& z.y < imagesloc[i].max_y && z.y > imagesloc[i].min_y) {

			return i + 1;
		}

	}

	return -1;
}

function handleDragEnd(e) {
	// this/e.target is the source node.
	this.style.opacity = '1';

	[].forEach.call(cols, function(col) {
		col.classList.remove('over');

	});
}

function cPos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : e.clientX - rect.left,
		y : e.clientY - rect.top
	};
}

function handleDrop(e) {

	e.stopPropagation(); // Stops some browsers from redirecting.
	e.preventDefault();
	switch (game) {
	case 1:

		// this/e.target is current target element.
		[].forEach.call(cols, function(col) {
			col.style.opacity = '1';

		});

		// Don't do anything if dropping the same column we're dragging.
		if (dragSrcEl != this) {

			if (dragSrcEl.firstChild.innerHTML == 9
					& this.firstChild.innerHTML == 4) {// drag 9 onto 4
				document.getElementById('columns').style.display = "none";
				document.getElementById("mainCanvas").style.display = "initial";
			}
			// Set the source column's HTML to the HTML of the column we dropped
			// on.
			dragSrcEl.innerHTML = this.innerHTML;
			this.innerHTML = e.dataTransfer.getData('text/html');

		}
		break;
	case 2:
		
		break;
	

	}
	return false;
}
var dragSrcEl = null;

function handleDragStart(e) {
	// Target (this) element is the source node.
	this.style.opacity = '0.4';

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
	e.stopPropagation(); // Stops some browsers from redirecting.
	e.preventDefault();

	e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer
										// object.

	return false;
}

function handleDragEnter(e) {
	// this / e.target is the current hover target.
	// this.classList.add('over');
}

function handleDragLeave(e) {
	// this.classList.remove('over'); // this / e.target is previous target
	// element.
}