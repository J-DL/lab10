"use strict";

var numberOfBlocks = 9;
var targetBlocks = [];
var trapBlock;
var targetTimer;
var trapTimer;
var instantTimer;


document.observe('dom:loaded', function()
{
	$("start").observe("click",beforeStarting);
	$("stop").observe("click",stopGame);

});

//Actions that need to be done before starting the game
function beforeStarting()
{
	$("state").innerHTML = "Ready";
	$("score").innerHTML = "0";
	
	startGame.delay(3);
}

function resetEveryThing()
{
	//Reset all global variables
	if(trapBlock !== undefined)
	{
		$$("div.block")[trapBlock].removeClassName("trap");
		targetBlocks.splice(targetBlocks.indexOf(trapBlock),1);
	}
	
	for(var i = 0;i<9 ;i++)
	{
		$$("div.block")[i].removeClassName("target");
	}
	
	targetBlocks = [];
	trapBlock = undefined;
	clearInterval(targetTimer);
	clearInterval(trapTimer);
	instantTimer = null;
	
	for(var i = 0; i<9; i++)
	{
		$$("div.block")[i].stopObserving("click",clickBlock);
	}
	
}

function startGame()
{
	resetEveryThing();
	
	startToCatch();
}

function stopGame()
{
	resetEveryThing();
	
	$("state").innerHTML = "Stop";
}

function getTarget()
{
	var isNotUnique = true;
	var targetNumber;
	
	while(isNotUnique)
	{
		targetNumber = Math.floor(Math.random()*(9 - 0)) + 0;
		
		isNotUnique = false;
		for(var i = 0; i<targetBlocks.length; i++)
		{
			if(targetBlocks[i] == targetNumber)
			{
				i = targetBlocks.length;
				isNotUnique = true;
			}
		}
	}
	
	return targetNumber;
}

function tooManyNormalBlocks()
{
	var length = 0;
	
	for(var j = 0; j<targetBlocks.length; j++)
	{
		if(targetBlocks[j] != trapBlock)
		{
			length++;
		}
	}
	
	if(length >= 4)
	{
		alert("You lose !");
		
		resetEveryThing();
		
		return true;
	}
	
	return false;
}

function createTarget()
{
	if(!tooManyNormalBlocks())
	{
		var targetNumber = getTarget();
		
		targetBlocks.push(targetNumber);
		
		$$("div.block")[targetNumber].addClassName("target");
	}
	
}

function removeClass(number,blocClass)
{
	$$("div.block")[number].removeClassName(blocClass);
}

function createTrapTarget()
{
	if(!tooManyNormalBlocks())
	{
		trapBlock = getTarget();
	
		targetBlocks.push(trapBlock);
		
		$$("div.block")[trapBlock].addClassName("trap");
		
		//After 2 seconds, we make the target block disapear 
		//and we remove its number from the targetBlocks array
		removeClass.delay(2,trapBlock,"trap");
		
		targetBlocks.splice(targetBlocks.indexOf(trapBlock),1);
	}
}

function clickBlock()
{
	if(this.hasClassName("trap"))
	{
		var score = parseInt($("score").innerHTML);
		
		$("score").innerHTML = score - 30;
		
		$$("div.block")[this.getAttribute("data-index")].removeClassName("trap");
	}
	else if(this.hasClassName("target"))
	{
		this.removeClassName("target");
		
		targetBlocks.splice(targetBlocks.indexOf(this.getAttribute("data-index")),1);
		
		var score = parseInt($("score").innerHTML);
		
		$("score").innerHTML = score + 20;
	}
	else
	{
		this.addClassName("wrong");
		
		removeClass.delay(0.1,this.getAttribute("data-index"),"wrong");
		
		var score = parseInt($("score").innerHTML);
		
		$("score").innerHTML = score - 10;
	}
}

function startToCatch()
{
	$("state").innerHTML = "Catch !";
	
	targetTimer = setInterval(createTarget,1000);
	
	trapTimer = setInterval(createTrapTarget,3000);
	
	for(var i = 0; i<9; i++)
	{
		$$("div.block")[i].observe("click",clickBlock);
	}
	
}