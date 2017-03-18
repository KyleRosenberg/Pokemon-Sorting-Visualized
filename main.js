var pokemonjsonurl = "https://raw.githubusercontent.com/KyleRosenberg/PokemonTeamBuilder/master/pokemon.j";

var pokemonToSort = [];

function getRandomPokemon(array){
	var pickedindecies = [];
	for (var i = 0; i<14; i++){
		var index = parseInt(Math.random()*array.length);
		while (pickedindecies.indexOf(index)!=-1){
			var index = parseInt(Math.random()*array.length);
		}
		pickedindecies.push(index);
	}
	for (var i = 0; i<pickedindecies.length; i++){
		pokemonToSort.push(array[pickedindecies[i]]);
	}
	setTableRow(pokemonToSort, 0);
}

function setTableRow(array, row){
	for (var i = 0; i<array.length; i++){
		$element = $('.sorttable tr:eq(' + row + ') td:eq('+(i+1)+')');
		var name = array[i].species.name;
		name = name.substr(0, 1).toUpperCase() + name.substr(1);
		$element.css("background-color", "white");
		$element.html('<div class="ui tiny image"><image style="max-width:100%;" src='+array[i].sprites.front_default+'/><br/>' + name + ': ' + (array[i].height/10) + 'm' + '</div>');
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
	$("#selection").click(function(){
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
		displayQueue(1, array, queue, $('#selection'));
	});
	$("#insertion").click(function(){
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
		displayQueue(2, array, queue, $('#insertion'));
	});
}

function displayQueue(index, array, queue, $button){
	var t = setInterval(function(){
			setTableRow(array, index);
			var event = queue.shift();
			if (event[0]=="compare"){
				var p1 = array[event[1]];
				var p2 = array[event[2]];
				$element1 = $('.sorttable tr:eq(' + index + ') td:eq('+(event[1]+1)+')');
				$element1.css("background-color", "yellow");
				$element2 = $('.sorttable tr:eq(' + index + ') td:eq('+(event[2]+1)+')');
				$element2.css("background-color", "yellow");
			} else if (event[0]=="swap"){
				var p1 = array[event[1]];
				var p2 = array[event[2]];
				array[event[1]] = p2;
				array[event[2]] = p1;
				$element1 = $('.sorttable tr:eq(' + index + ') td:eq('+(event[1]+1)+')');
				$element1.css("background-color", "blue");
				$element2 = $('.sorttable tr:eq(' + index + ') td:eq('+(event[2]+1)+')');
				$element2.css("background-color", "blue");
			}
			if (queue.length == 0){
				clearInterval(t)
				setTableRow(array, index);
				$button.removeClass("red");
				$button.addClass("green");
			}
		}, 200);
}
