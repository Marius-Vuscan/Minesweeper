function Micon(){alert("Game creator: Marius Vuscan")};
//on game start
$(".container").hide();
$("#timer").hide();
$("#mineScore").hide();
$("#newGameMS").hide();

function hideAndShow()//show intputs[type="button"] array and hide menu items
{
	$(".container").show();
	$("#timer").show();
	$("#mineScore").show();
	$("#newGameMS").show();
	$("#crms").hide();
	$("#titleM").hide();
	$("#MinesweeperContent").hide();
	game();
}

// select difficulty level
$("#MBeginner").click(function(){
	buttonCheck=1;
	hideAndShow();
});
$("#MIntermediate").click(function(){
	buttonCheck=2;
	hideAndShow();
});
$("#MExpert").click(function(){
	buttonCheck=3;
	hideAndShow();
});

function game()//game function set the size and number of inputs and number of mines
{
	switch(buttonCheck)
	{
		case 1:
		{
			var n=10;
			var m=10;
			var min=10;
			$(".Minesweeper").width("200px");
			$(".container").width("200px");
			$(".container").height("200px");
			break;
		}
		case 2:
		{
			var n=16;
			var m=16;
			var min=40;
			$(".Minesweeper").width("320px");
			$(".container").width("320px");
			$(".container").height("320px");
			break;
		}
		case 3:
		{
			var n=16;
			var m=30;
			var min=100;
			$(".Minesweeper").width("600px");
			$(".container").width("600px");
			$(".container").height("320px");
			break;
		}
	}

	//initializate some variables
	var bool=[];
	var nrFound=0;
	var nr=0;
	var k=0;

	//timer
	$("#timer").text("Time: " + k);
	var timer1=setInterval(myTimer ,1000);
	function myTimer()
	{
		k++;
		$("#timer").text("Time: " + k);
	}

	//create dynamically buttons
	var elements=[];
	for (i = 0; i < n; i++)
	{
		for(j=0;j<m;j++)
		{
				var input = document.createElement("input");
				input.type = "button";
	    	elements.push(input);
	    	bool.push(false);
		}
	}
	$(".container").append(elements);

	//add class "buttonClass"
	for(i=0;i<elements.length;i++)
		elements[i].classList.add("buttonClass");

	//add bombs
	for(i=0;i<min;i++)
		elements[i].value="*";

	//shuffle
	function Shuffle()
	{
	    for (i = 0; i < elements.length; i++)
	    {
	        var j =i + Math.floor((Math.random() * elements.length) -i);
	        var aux = elements[j].value;
	        elements[j].value=elements[i].value;
	        elements[i].value=aux;

	        var aux2 = elements[j].name;
	        elements[j].name=elements[i].name;
	        elements[i].name=aux2;
	    }
	}
	Shuffle();

	//add numbers around the mines
	for(i=0;i<n*m;i++)
	{
		if(elements[i].value!="*")
		{
			var pe=0;
			if (i+1 < elements.length && i%m!=(m-1) && elements[i+1].value==="*") pe++;
			if (i-1 >= 0 && i%m!=0 && elements[i-1].value==="*") pe++;
			if (i-m >= 0 && elements[i-m].value==="*") pe++;
			if (i+m < elements.length && elements[i+m].value==="*") pe++;
			if (i-(m+1) >= 0 && i%m!=0 && elements[i-(m+1)].value==="*") pe++;
			if (i+(m+1) < elements.length && i%m!=(m-1) && elements[i+(m+1)].value==="*") pe++;
			if (i-(m-1) >= 0 && i%m!=(m-1) && elements[i-(m-1)].value==="*") pe++;
			if (i+(m-1) < elements.length && i%m!=0 && elements[i+(m-1)].value==="*") pe++;

			if(pe===0)
			{
				elements[i].value=" ";
			}
			else
			{
				nr++;
				elements[i].value=pe;
			}
		}
	}

	//foreach elements i set event click and right click (contextmenu)
	elements.forEach((element, key) => {
			element.addEventListener('click', () => {
				if(elements[key].style.backgroundColor!="yellow")
				{
					if(elements[key].value==="*")
					{
						clearTimeout(timer1);
						elements.forEach((element, key) => {
							elements[key].disabled = true;
						})
						alert("Boom!");
					}
					else
						neg(element,key);
				}
			})
			element.addEventListener('contextmenu', function(ev) {
			    ev.preventDefault();
			    rightClick(element,key);
			    return false;
			}, false);
	})

	function newGame()//newGame function takes us back to the main page
	{
		$(".container").empty();
		$(".container").hide();
		$("#timer").hide();
		$("#mineScore").hide();
		$("#newGameMS").hide();
		$("#crms").show();
		$("#titleM").show();
		$("#MinesweeperContent").show();
		$(".Minesweeper").width("250px");
		$(".container").width("250px");
		$(".container").height("200px");
		clearTimeout(timer1);
			k=0;
	}
	$("#newGameMS").click(function(){
		newGame();
	});

	//score
	var tryMine=min;
	$("#mineScore").text("Mines: " + tryMine);

	var minesFound=0;
	var aux;
	var elementsDuplicate=[];
	for(i=0;i<elements.length;i++)
	{
		elementsDuplicate[i]=elements[i].value;
	}

	function rightClick(element,key)//right click
	{
		if(elements[key].style.backgroundColor != "yellow" && elements[key].style.backgroundColor != "white")
		{
			if(elements[key].value==="*")
				minesFound++;
			elements[key].value="!";
			elements[key].style.backgroundColor = "yellow";
			tryMine--;
			if (minesFound===min) //win
			{
				alert("Good Job! Your time is: "+k);
				clearTimeout(timer1);
				k=0;
				elements.forEach((element, key) => {
					elements[key].disabled = true;
				})
			}
		}
		else if(elements[key].style.backgroundColor != "white")
		{
			elements[key].style.backgroundColor = "darkgrey";
			elements[key].value=elementsDuplicate[key];
			if(elementsDuplicate[key]==="*")
				minesFound--;
			tryMine++;
		}
		$("#mineScore").text("Mines: " + tryMine);
	}

	function neg(element,key)//find neighbors
	{
		elements[key].style.backgroundColor = "white";
		elements[key].classList.add("active");
		switch(elements[key].value)
		{
			case "1": elements[key].style.color = "blue"; break;
			case "2": elements[key].style.color = "green"; break;
			case "3": elements[key].style.color = "red"; break;
			case "4": elements[key].style.color = "darkblue"; break;
			case "5": elements[key].style.color = "darkred"; break;
			default: elements[key].style.color = "orange"; break;
		}
		if (elements[key].value===" " && bool[key]===false)
		{

			bool[key]=true;
			if(key===0)
			{
				neg(element,key+1);
				neg(element,key+m);
				neg(element,key+(m+1));
			}
			else if(key===m-1)
			{
				neg(element,key-1);
				neg(element,key+m);
				neg(element,key+(m-1));
			}
			else if(key===n*m-m)
			{
				neg(element,key+1);
				neg(element,key-m);
				neg(element,key-(m-1));
			}
			else if(key===n*m-1)
			{
				neg(element,key-1);
				neg(element,key-m);
				neg(element,key-(m+1));
			}
			else if(key%m===0)
			{
				neg(element,key+1);
				neg(element,key-m);
				neg(element,key+m);
				neg(element,key-(m-1));
				neg(element,key+(m+1));
			}
			else if(key<m)
			{
				neg(element,key+1);
				neg(element,key-1);
				neg(element,key+m);
				neg(element,key+(m+1));
				neg(element,key+(m-1));
			}
			else if((key+1)%m===0)
			{
				neg(element,key-1);
				neg(element,key+m);
				neg(element,key-m);
				neg(element,key-(m+1));
				neg(element,key+(m-1));
			}
			else if(key<n*m && key>n*m-m)
			{
				neg(element,key+1);
				neg(element,key-1);
				neg(element,key-m);
				neg(element,key-(m+1));
				neg(element,key-(m-1));
			}
			else
			{
				neg(element,key+1);
				neg(element,key-1);
				neg(element,key+m);
				neg(element,key-m);
				neg(element,key+(m+1));
				neg(element,key-(m+1));
				neg(element,key+(m-1));
				neg(element,key-(m-1));
			}
		}
	}
}
