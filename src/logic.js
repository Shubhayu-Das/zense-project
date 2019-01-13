// JavaScript Code Part begins:

//Globally used loop variables
var i, j;
            
// Important variables and connstants to store configuration and colours of all faces
const black = "black", green = "green", blue = "rgb(25,25,180)", white = "white", yellow = "yellow", red = "red", orange = "rgb(255,145,0)";
const cubeSize = 3;
var cubeFaceGreen = [], cubeFaceRed = [], cubeFaceOrange = [], cubeFaceBlue = [], cubeFaceWhite = [], cubeFaceYellow= [];
var Cube = [cubeFaceGreen,cubeFaceRed,cubeFaceBlue,cubeFaceOrange];
var frontFace = Cube[0], rightFace = Cube[1], leftFace = Cube[3], backFace = Cube[2], topFace = cubeFaceWhite, bottomFace = cubeFaceYellow;

//Other control/swapping variables.
var swapper = [], swapper1 = [];
var startLayer, endLayer;
var temp, tempCol, timerTemp;
var trigger = false, animType, isPressed = false;

//The coordinates of the Cube and all the parameters required to draw all the components
var startX = 0.25*window.innerHeight, startY = 0.18*window.innerHeight, edgeSize = (0.065*window.innerHeight)-10*(cubeSize - 3), bufferSpace = 5, frameRate = 60, control = 0, outMove = 15;
var sideX = (startX + cubeSize*(edgeSize + bufferSpace)), sideY = startY, sideSize = edgeSize/2;

//List of operations for the cube shuffling function
var scrambleOperations = [[1], [1, true], [2], [1, true], [5, false], [3],  [4, false], [-1], [1, true], [-2],
                        [5, false], [2], [1, true], [-1], [2, true], [1], [0, true], [4, false], [3], [5, false], [-3],
                        [4, false], [-3], [0, true], [-1], [2], [4, false], [1], [2, false], [3], [5, false], [0], [1, true], 
                        [3, false], [2], [1, true], [-1], [2, true], [1], [0, true], [4, false], [3], [5, false], [-3] ];

//Declaring all the variables to access the 2d context of canvas, which are globally required
var elem = document.getElementById("Screen");
var ctx = elem.getContext("2d");
var ctx1 = elem.getContext("2d");
var ctx2 = elem.getContext("2d");
var cont = elem.getContext("2d");

//Cube initializer with the fundamental colors, not reproducable to larger cube size yet
for(i = 0; i < cubeSize ;i++)
{
    cubeFaceGreen.push([green,green,green]);
    cubeFaceBlue.push([blue,blue,blue]);
    cubeFaceRed.push([red,red,red]);
    cubeFaceOrange.push([orange,orange,orange]);
    cubeFaceWhite.push([white,white,white]);
    cubeFaceYellow.push([yellow,yellow,yellow]);
}

//Custom function to generate random numbers as per requirement
function randomGenerator(offset, multiplier)
{
    return (Math.floor(offset) + Math.floor(Math.random() * multiplier));
}

// Function to shuffle the cube on pressing the desginated button
function scrambleCube()
{
    var startIndex, endIndex;
    //performing random number of operations on the current cube configuration
    //Selecting the start and end positions in the list of operations
    if( Math.random() < 0.5)
        {
            endIndex = randomGenerator(scrambleOperations.length/2, (scrambleOperations.length - 1));
            startIndex = randomGenerator(0, scrambleOperations.length/4);
        }
    else
        {
            endIndex = randomGenerator(2*scrambleOperations.length/3, (scrambleOperations.length - 1));
            startIndex = randomGenerator(0, scrambleOperations.length/3);
        }
    
    //Extracting data from the list of operations and performing them
    var operationCode, Direction;

    for(var loop = startIndex; loop < endIndex; loop++)
    {
        operationCode = scrambleOperations[loop][0];
        
        if(scrambleOperations[loop].length == 1)
            Direction = 15
        else
            Direction = scrambleOperations[loop][1];

        onClick(operationCode, Direction);
    }
}

//Function to manipulate the adjacent face arrays as per requirement on clicking any button
/*
    * direction == 1 is anticlockwise motion of top wheel, viewed from above
    * direction == -1 is clockwise motion of top wheel, viewed from above
    * direction == 2 is anticlockwise motion of the right wheel, viewed from the right end, white up, green front
    * direction == -2 is clockwise motion of the right wheel, viewed from the right end, white up,  green front
    * direction == 3 is anticlockwise motion of the left wheel, when viewed from the left end,  white up, green front
    * direction == -3 is clockwise motion of the left wheel, when viewed from the left end,  white up, green front
    * direction == 4 is clockwise motion of the bottom wheel, when viewed from the bottom end,  white up
    * direction == -4 is clockwise motion of the bottom wheel, when viewed from the bottom end,  white up
*/

function rotateFace(direction, currentArray)
{
    /* Reading the array of the boundary colours
    
        Extraction pattern:
            Original face of currentArray:
                1 2 3
                4 5 6
                7 8 9

            Then swapper stores in the following order:
                7, 4, 1, 2, 3, 6, 9, 8
            Anticlockwise read from bottom right.
    */

    // Reading the boundary elements as given above
    swapper1 = [];
    for(i = 0; i < cubeSize; i++)
    {
        swapper1.push(currentArray[i][0]);
    }
    for(i = 1; i < cubeSize; i++)
    {
        swapper1.push(currentArray[cubeSize-1][i]);
    }
    for(i = 1; i < cubeSize ; i++)
    {
        swapper1.push(currentArray[cubeSize-i-1][cubeSize-1]);
    }
    for(i = 1; i < cubeSize-1; i++)
    {
        swapper1.push(currentArray[0][cubeSize-i-1]);
    }

    // Performing actions on the array depending on the direction of operation
    if(direction == 1)
    {       
        //Manually without using push/unshift and splice
            for(j = 0;j < cubeSize - 1; j++)
            {   temp = swapper1[0];
                for(i = 0; i< cubeSize*cubeSize-1 ; i++)
                {
                    swapper1[i] = swapper1[i+1];
                }
                swapper1[swapper1.length-1] = temp;
            }
    }
    else if(direction == -1)
    {       
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
            
    }
    else if(direction == 2)
    {
         swapper1.reverse();
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
        swapper1.reverse();
    }
    else if(direction == -2)
    {
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
        }
    else if(direction == 3)
    {
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
    }
    else if(direction == -3)
    {
         swapper1.reverse();
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
        swapper1.reverse();
    }
    else if(direction == 4)
    {
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
    }
    else if(direction == -4)
    {
         swapper1.reverse();
            for( i = 0; i < cubeSize -1; i++)
            {
                temp = swapper1.splice(swapper1.length-1,1);
                swapper1.unshift(temp);
            }
        swapper1.reverse();
    }

    //Writing back elements to the currentArray in the required order as given above
    for(i = 0; i < cubeSize ; i++)
    {
        currentArray[i][0] = swapper1.splice(0,1);
    }
    for(i = 1; i < cubeSize; i++)
    {
        currentArray[cubeSize-1][i] = swapper1.splice(0,1);
    }
    for(i = 1; i < cubeSize-1 ; i++)
    {
        currentArray[cubeSize-i-1][cubeSize-1] = swapper1.splice(0,1);
    }
    
    for(i = 0; i < cubeSize-1; i++)
    {
        currentArray[0][cubeSize - 1 -i] = swapper1.splice(0,1);
    }
    return currentArray;
}
//Rotate the horizontal layers on clicking any button
function rotateHorizontal(index)
{
    trigger = false;
    if(index < 0)
    {
        Cube.reverse();
        trigger = true;
        index += 1;
        index *= -1;
    }
    else
        index -= 1;

    swapper = Cube[0][index];
    Cube[0][index] = Cube[1][index];
    Cube[1][index] = Cube[2][index];
    Cube[2][index] = Cube[3][index];
    Cube[3][index] = swapper;

    if(trigger)
    {
        Cube.reverse();
    }
    //Turn the sides which are not on the current face but will affect the adjacent sides
    if(index == 0)
    {
        if(trigger)
            {
                topFace = rotateFace(-1, topFace);
                trigger = false;
            }
        else
            topFace = rotateFace(1, topFace);
    }

    else if( index == 2 )
    {
        if(trigger)
            {
                rotateFace(4, bottom);
                trigger = false;
            }
        else
            rotateFace(-4, bottomFace);
    }

}

//Rotate the vertical layers on pressing the buttons
//Operates on 4 arrays at any point if time
function rotateVertical(index, trigger)
{
    for(i = 0; i < cubeSize; i++)
    {
        if(trigger == true)         //Anticlockwise rotation, on viewing from the right hand side
        {
            swapper = frontFace[i][index];
            frontFace[i][index] = topFace[i][index];
            topFace[i][index] = backFace[cubeSize -i -1][cubeSize -index -1];
            backFace[cubeSize - i -1][cubeSize -index -1] = bottomFace[i][index];
            bottomFace[i][index] = swapper;

        }
        else if(trigger == false)      //Clockwise rotation, on viewing from the right hand side
        {
            if(i == 0)
                index -= 3;
            
            swapper = frontFace[i][index];
            frontFace[i][index] = bottomFace[i][index];
            bottomFace[i][index] = backFace[i][cubeSize -index -1];
            backFace[i][cubeSize -index -1] = topFace[i][index];
            topFace[i][index] = swapper;
        }
    }
    //Rotation of the adjacent faces as and when required, even if they cant be seen directly
    if( index == 2 )
        if(trigger)
            rotateFace(-2, rightFace);
        else
            rotateFace(2 , rightFace);
    
    else if( index == 0 )
        if(trigger)
            rotateFace(-3, leftFace);
        else
            rotateFace(3 , leftFace);

    return 0;
}
//Logic part ends here
//--------------------------------------------------------------------------------------------------------------------------------------
//Graphics drawing part starts here

// Function to display the help menu on passing over the help button
function playSound()
{
    var audio = document.getElementById("audio");
    audio.play();
}
function displayHelp(showHelp)
{
    //Simply modifying the "visibility" CSS parameter
    if(showHelp)
        document.getElementById("helpPic").style.visibility = 'visible';

    else
        document.getElementById("helpPic").style.visibility = 'hidden';
}

//Function to display the hidden faces on passing mouse over the "eye" button, ERROR
function displayBackFace(showBackFace)
{
    if(showBackFace)
    {
        topFace = rotateFace(-1, cubeFaceYellow);
        frontFace = [];
        rightFace = [];
        for(var k = 0; k < cubeSize; k++)
        {
            frontFace.push(cubeFaceOrange[k].reverse());
            rightFace.push(cubeFaceBlue[k].reverse());
        }
        frontFace.reverse();
        rightFace.reverse();
    }
    else
    {
        rotateFace(1, cubeFaceYellow);
        for(var k = 0; k < cubeSize; k++)
        {
            cubeFaceOrange[k].reverse();
            cubeFaceBlue[k].reverse();
        }
        frontFace = cubeFaceGreen;
        topFace = cubeFaceWhite;
        rightFace = cubeFaceRed;
    }
    renderStatic(0, cubeSize);
}

//Function to set up the background as per the size of the monitor
function drawBackground()
{
    //Adjust the size of the central canvas on which the cube is drawn
    cont.canvas.width = 0.4*window.innerWidth;
    cont.canvas.height = 0.8*window.innerHeight;
}

//Following two functions to draw the individual blocks in the cube:

//Function to draw the front and the side faces
function drawSide(topLeftX, topLeftY, topRightX, topRightY, edge, bufferSpace, Color)
{
    ctx2.fillStyle = Color;
    ctx2.beginPath();
    ctx2.moveTo(topLeftX , topLeftY);
    ctx2.lineTo(topRightX, topRightY);
    ctx2.lineTo(topRightX, topRightY + edge);
    ctx2.lineTo(topLeftX, topLeftY + edge);
    ctx2.lineTo(topLeftX , topLeftY);
    ctx2.closePath();
    ctx2.fill();
}

//Custom function to draw the top face because of large difference in the shape of each block
function drawTop(frontLeftX, frontLeftY, frontRightX, frontRightY, Color)
{
    ctx.fillStyle = Color;
    ctx.beginPath();
    ctx.moveTo(frontLeftX, frontLeftY);
    ctx.lineTo(frontRightX, frontRightY);
    ctx.lineTo(frontRightX - sideSize, sideSize + frontRightY);
    ctx.lineTo(frontLeftX - sideSize, sideSize + frontLeftY);
    ctx.lineTo(frontLeftX, frontLeftY);
    ctx.closePath();
    ctx.fill();
}

//To call the drawing functions with appropriate coordinates when there is no motion i.e. no animations are taking place
function renderStatic(startLayer, endLayer)
{
    if(startLayer == 0 && endLayer == cubeSize)
        drawBackground();
   
   for( i = 0; i < cubeSize; i++)
    for( j = startLayer; j < endLayer; j++)
        {
            drawSide(startX + i*(edgeSize + bufferSpace),
                    startY + j*(edgeSize + bufferSpace),
                    startX + edgeSize + i*(edgeSize + bufferSpace),
                    startY + j*(edgeSize + bufferSpace),
                    edgeSize, bufferSpace, frontFace[j][i]);
            
            drawSide(sideX + i*(sideSize+bufferSpace),
                    sideY - i*(sideSize + bufferSpace) + j*(edgeSize+bufferSpace),
                    (sideX + sideSize + i*(sideSize + bufferSpace)),
                    sideY - sideSize - i*(sideSize + bufferSpace)+ j*(edgeSize+bufferSpace),
                    edgeSize, bufferSpace, rightFace[j][i]);
        }
    
    for( i = 0; i < cubeSize; i++)
        for( j = 0; j < cubeSize; j++)
            if(startLayer == 0 && endLayer == cubeSize)
            drawTop(startX + i*(edgeSize+bufferSpace) + j*sideSize + sideSize + j*bufferSpace,
                    startY - sideSize -  j*(sideSize + bufferSpace) - bufferSpace,
                    startX + i*(edgeSize+bufferSpace) + edgeSize + j*sideSize + sideSize + j*bufferSpace,
                    startY- sideSize - bufferSpace - j*(sideSize+ bufferSpace),
                    topFace[cubeSize - 1 -j][i]);   
}

//To call the drawing functions with appropriate coordinates when there some animation taking place during turning of the layers
function renderMotion(startLayer, endLayer, animType)
{
    control++;
    if( control < frameRate && control > 0)
    {   
        //Top Layer row1 animation
        if(animType == 1)
        for( i = 0; i < cubeSize; i++)
            for( j = startLayer; j < endLayer; j++)
            {
                //The front face which goes left
                drawSide(startX + (1 - control/frameRate)*i*(edgeSize + bufferSpace),
                        startY + j*(edgeSize+bufferSpace) ,
                        startX + (1 - control/frameRate)*(i*(edgeSize + bufferSpace) + edgeSize),
                        startY + j*(edgeSize+bufferSpace),    
                        edgeSize - i*control/frameRate, bufferSpace, frontFace[j][i])

                //The right side which comes front
                drawSide(sideX + i*(sideSize*(1-control/frameRate) + bufferSpace) - (3*bufferSpace + (cubeSize - i)*edgeSize)*control/frameRate,
                        sideY - i*(sideSize + bufferSpace - control*sideSize/frameRate) + j*(edgeSize+bufferSpace),
                        sideX + sideSize + i*(sideSize + bufferSpace) - (3*bufferSpace + (i+1)* sideSize + (cubeSize - 1- i)*edgeSize)*control/frameRate,
                        sideY - i*(sideSize + bufferSpace)+ j*(edgeSize+bufferSpace) + ((i + 1)*control/frameRate - 1)*sideSize,
                        edgeSize, bufferSpace, rightFace[j][i]);
                
                //The rear side which comes right
                if( control > 30 )
                drawSide(sideX + ((cubeSize-3)*bufferSpace)*control/frameRate + i*(sideSize+bufferSpace),
                        sideY - i*sideSize + j*edgeSize - (1-control/frameRate)*1.5*(bufferSpace + edgeSize) - (i-j+1)*bufferSpace,
                        sideX + ((cubeSize-3)*bufferSpace + sideSize)*control/frameRate + i*(sideSize+bufferSpace),
                        sideY - (i + 1)*sideSize + j*edgeSize - (1-control/frameRate)*1.5*(bufferSpace + edgeSize) - (i-j+1)*bufferSpace,
                        edgeSize, bufferSpace, backFace[j][i]);
            }
        
        //Top layer row2 animation
        if(animType == 2)
        for( i = 0; i < cubeSize; i++)
            for( j = startLayer; j < endLayer; j++)
            {
                //The right side which goes back
                if(control < 30)
                drawSide(sideX + i*(sideSize+bufferSpace) + ((cubeSize -i)*(sideSize + bufferSpace) - bufferSpace)*control/frameRate,
                         sideY - i*(sideSize + bufferSpace) + j*(edgeSize+bufferSpace) - (cubeSize -j/cubeSize)*control*(bufferSpace + sideSize)/frameRate,
                         sideX + sideSize + i*(sideSize + bufferSpace) + (cubeSize -1 -i)*(sideSize + bufferSpace)*control/frameRate,
                         sideY - sideSize - i*(sideSize + bufferSpace) + j*(edgeSize+bufferSpace) - (cubeSize -j/cubeSize)*control*(sideSize + bufferSpace)/frameRate,
                         edgeSize - control*(cubeSize -1 -i)*bufferSpace/frameRate, bufferSpace, rightFace[j][i]);
                
                //The front face which goes right
                drawSide(startX + i*(edgeSize + bufferSpace) + (cubeSize*(bufferSpace + edgeSize) - edgeSize + (cubeSize -i -1)*sideSize)*control/frameRate,
                        startY + j*(edgeSize + bufferSpace) - (i*(sideSize + bufferSpace) + j*0.5*(edgeSize - 2*sideSize + bufferSpace))*control/frameRate,
                        startX + i*(edgeSize + bufferSpace) + edgeSize +  (cubeSize*(bufferSpace + edgeSize) - edgeSize + (cubeSize -i -2)*sideSize)*control/frameRate,
                        startY + j*(edgeSize + bufferSpace) - ((i + 1)*(sideSize + bufferSpace) + j*0.5*(edgeSize -2*sideSize + bufferSpace))*control/frameRate,
                        edgeSize, bufferSpace, frontFace[j][i]);
                
                //The left face which will come front
                drawSide(startX + i*(edgeSize + bufferSpace)*control/frameRate,
                         startY + j*(edgeSize + bufferSpace),
                         startX + (i+1)*edgeSize*control/frameRate + i*bufferSpace*control/frameRate,
                         startY + j*(edgeSize + bufferSpace),
                        edgeSize, bufferSpace, leftFace[j][i]);
            }
        //   For anticlockwise rotation of colours of top face only; to be replaced with animations later
        for( i = 0; i < cubeSize; i++)
            for( j = 0; j < cubeSize; j++)    
                {
                    tempCol = topFace[cubeSize - 1 -j][i];
                  drawTop(startX + i*(edgeSize+bufferSpace) + j*sideSize + sideSize + j*bufferSpace,
                    startY - sideSize -  j*(sideSize + bufferSpace) - bufferSpace,
                    startX + i*(edgeSize+bufferSpace) + edgeSize + j*sideSize + sideSize + j*bufferSpace,
                    startY- sideSize - bufferSpace - j*(sideSize+ bufferSpace),
                    tempCol);   
                }
        
        
        renderStatic(0, startLayer);
        renderStatic(endLayer, cubeSize);

    }
    else if(control == frameRate)
    {
        control = -1; // Failure condition to prevent loop from running extra times
        isPressed = false;  //Prevent the system from detecting a key which is continuously pressed down
        clearInterval(timerTemp);   // Stop the setInterval from running as animations have completed
        renderStatic(0, cubeSize);  //Draw the final structure of the Cube
    }
}

//The function called when the buttons are clicked, indirectly calls the renderStatic() or renderMotion() as per need
function onClick(code_direc, status = 15)
{
    var clearScreen = elem.getContext("2d");
    playSound();
    
    frontFace = Cube[0];
    rightFace = Cube[1];
    leftFace = Cube[3];
    backFace = Cube[2];
    topFace = cubeFaceWhite;
    bottomFace = cubeFaceYellow;
    
    if(!isPressed)
    {
        if(code_direc == 1 && status == 15)
        {
            startLayer = 0;
            endLayer = 1;
            animType = 1;
        }
        else if(code_direc == 2 && status == 15)
        {
            startLayer = 1;
            endLayer = 2;
            animType = 1;
        }
        else if(code_direc == 3 && status == 15)
        {
            startLayer = 2;
            endLayer = 3;
            animType = 1;
        }
        else if(code_direc == -1 && status == 15)
        {
            startLayer = 0;
            endLayer = 1;
            animType = 2;
        }
        else if(code_direc == -2 && status == 15)
        {
            startLayer = 1;
            endLayer = 2;
            animType = 2;
        }
        else if(code_direc == -3 && status == 15)
        {
            startLayer = 2;
            endLayer = 3;
            animType = 2;
        }
        else
        {   
            if(code_direc >= 0 && status != 15)
                rotateVertical(code_direc, status);
            
            renderStatic(0, cubeSize);
            endLayer = 2*cubeSize;
            startLayer = -1;
        }
    
        control = 0;
        if(control != 39 && status == 15 && !isPressed)
            {
                isPressed = true;
                timerTemp = setInterval(function()
                            {
                                clearScreen.clearRect(0, 0, elem.width, elem.height);
                                renderMotion(startLayer, endLayer, animType);
                                
                                if(control == frameRate - 1)
                                    rotateHorizontal(code_direc);
                                
                                document.getElementById("display").innerHTML = code_direc;
                            }, 8);
            }
    }
}   

//Drawing the basic structure when the page loads
renderStatic(0, cubeSize);