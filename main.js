var pokemonjsonurl = "https://raw.githubusercontent.com/KyleRosenberg/PokemonTeamBuilder/master/pokemon.j";

var pokemonToSort = [];
var pokemonjson;

function getRandomPokemon(array){
	pokemonToSort = [];
	var pickedindecies = [];
	for (var i = 0; i<14; i++){
		var index = parseInt(Math.random()*array.length);
		while (containsHeight(pickedindecies, array[index].height)){
			var index = parseInt(Math.random()*array.length);
		}
		pickedindecies.push(index);
	}
	for (var i = 0; i<pickedindecies.length; i++){
		pokemonToSort.push(array[pickedindecies[i]]);
	}
	setTableRow(pokemonToSort, 0);
}

function containsHeight(a, h){
	for (var i = 0; i<a.length; i++){
		if (pokemonjson[a[i]].height == h){
			return true;
		}
	}
	return false;
}

function setTableRow(array, row){
	row++;
	for (var i = 0; i<array.length; i++){
		$element = $('.sorttable tr:eq(' + row + ') td:eq('+(i+1)+')');
		var name = array[i].species.name;
		name = name.substr(0, 1).toUpperCase() + name.substr(1);
		$element.css("background-color", "white");
		$element.html('<div class="ui tiny image"><image style="max-width:100%;" src='+array[i].sprites.front_default+'/><br/>' + name + ':<br/>' + (array[i].height/10) + 'm' + '</div>');
	}
}

$.ajax({ 
	url: pokemonjsonurl, success: function(data) {
		pokemonjson = JSON.parse(data);
		$('.ui.dimmer').removeClass("active");
		getRandomPokemon(pokemonjson);
		setEventHandlers();
	}
});

function setEventHandlers(){
	$button1 = $("#selection");
	$button1.click(function(){
		if ($button1.hasClass("red")){
			$button1.removeClass("red");
			$button1.addClass("orange");
			var queue = [];
			var array = pokemonToSort.slice();
			for (var i = 0; i<array.length; i++){
				var minIndex = i;
				for (var j = i+1; j<array.length; j++){
					queue.push(["compare", minIndex, j]);
					if (array[j].height < array[minIndex].height){
						minIndex = j;
					}
				} 
				if (minIndex != i){
					queue.push(["swap", i, minIndex]);
					var temp = array[i];
					array[i] = array[minIndex];
					array[minIndex] = temp;
				}
			}
			array = pokemonToSort.slice();
			displayQueue(1, array, queue, $button1);
		}
	});
	$button2 = $("#insertion");
	$button2.click(function(){
		$button2 = $("#insertion");
		if ($button2.hasClass("red")){
			$button2.removeClass("red");
			$button2.addClass("orange");
			setTableRow(pokemonToSort, 2);
			var queue = [];
			var j = 0;
			var array = pokemonToSort.slice();
			for (var i = 0; i<array.length; i++){
				j = i;
				while (j>0 && array[j].height < array[j-1].height){
					queue.push(["compare", j, j-1]);
					var temp = array[j];
					array[j] = array[j-1];
					array[j-1] = temp;
					queue.push(["swap", j, j-1]);
					j--;
				}
				if (j>0){
					queue.push(["compare", j, j-1]);
				}
			}
			array = pokemonToSort.slice();
			displayQueue(2, array, queue, $button2);
		}
	});
	$button3 = $("#bubble");
	$button3.click(function(){
		if ($button3.hasClass("red")){
			$button3.removeClass("red");
			$button3.addClass("orange");
			setTableRow(pokemonToSort, 3);
			var queue = [];
			var array = pokemonToSort.slice();
			for (var i = 0; i<array.length-1; i++){
				for (var j = 0; j<array.length-i-1; j++){
					queue.push(["compare", j, j+1]);
					if (array[j].height > array[j+1].height){
						queue.push(["swap", j, j+1]);
						var temp = array[j];
						array[j] = array[j+1];
						array[j+1] = temp;
					}
				}
			}
			array = pokemonToSort.slice();
			displayQueue(3, array, queue, $button3);
		}
	});
	$button4 = $("#quick");
	$button4.click(function(){
		if ($button4.hasClass("red")){
			$button4.removeClass("red");
			$button4.addClass("orange");
			setTableRow(pokemonToSort, 4);
			var queue = [];
			var array = pokemonToSort.slice();
			quickSort(queue, array, 0, array.length-1);
			array = pokemonToSort.slice();
			displayQueue(4, array, queue, $button4);
		}
	});
	$button5 = $("#all");
	$button5.click(function(){
		if ($button1.hasClass("red") && $button2.hasClass("red") && $button3.hasClass("red") && $button4.hasClass("red")){
			$button1.click();
			$button2.click();
			$button3.click();
			$button4.click();
		}
	});
	$button6 = $("#new");
	$button6.click(function(){
		for (var i = 1; i<6; i++){
			for (var j = 1; j<15; j++){
				$element = $('.sorttable tr:eq(' + i + ') td:eq('+j+')');
				$element.html('');
				$element.css('background-color', 'white');
			}
		}
		getRandomPokemon(pokemonjson);
		$button1.removeClass("green");
		$button1.removeClass("orange");
		$button1.addClass("red");
		$button2.removeClass("green");
		$button2.removeClass("orange");
		$button2.addClass("red");
		$button3.removeClass("green");
		$button3.removeClass("orange");
		$button3.addClass("red");
		$button4.removeClass("green");
		$button4.removeClass("orange");
		$button4.addClass("red");
	});
}

function quickSort(queue, array, left, right){
	if (left<right){
		p = partition(queue, array, left, right);
		quickSort(queue, array, left, p-1);
		quickSort(queue, array, p+1, right);
	}
}

function partition(queue, array, left, right){
	pivot = right;
	i = left-1;
	for (var j = left; j<right; j++){
		if (j>=i){
			queue.push(["compare", j, pivot]);
			if (array[j].height < array[pivot].height){
				i++;
				queue.push(["swap", i, j]);
				temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		}
	}
	queue.push(["swap", i+1, right]);
	temp = array[i+1];
	array[i+1] = array[right];
	array[right] = temp;
	return i+1;
}

function displayQueue(index, array, queue, $button){
	index++;
	var t = setInterval(function(){
			setTableRow(array, index-1);
			var event = queue.shift();
			if (event[0]=="compare"){
				var p1 = array[event[1]];
				var p2 = array[event[2]];
				$element1 = $('.sorttable tr:eq(' + index + ') td:eq('+(event[1]+1)+')');
				$element1.css("background-color", "yellow");
				$element2 = $('.sorttable tr:eq(' + index + ') td:eq('+(event[2]+1)+')');
				$element2.css("background-color", "yellow");
			} else if (event[0]=="swap"){
				var p1 = event[1];
				var p2 = event[2];
				var temp = array[p1];
				array[p1] = array[p2];
				array[p2] = temp;
				$element1 = $('.sorttable tr:eq(' + index + ') td:eq('+(p1+1)+')');
				$element1.css("background-color", "blue");
				$element2 = $('.sorttable tr:eq(' + index + ') td:eq('+(p2+1)+')');
				$element2.css("background-color", "blue");
			}
			if (queue.length == 0){
				clearInterval(t)
				setTableRow(array, index-1);
				$button.removeClass("orange");
				$button.addClass("green");
			}
		}, 200);
}
