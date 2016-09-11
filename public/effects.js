		var socket = io();
		
		var stars = [];
		var myObstacle1 = [];
		var myObstacle2 = [];
		var myObstacle3 = [];
		var missile = [];
		var missile1 = [];
		var keyFlag = 0;
		var mouseFlag = 0;
		var angle = 30;
		var user1 = "";
		var user2 = "";
		var score1 = 0;
		var score2 = 0;
		var myScore1 = "";
		var myScore2 = "";
		var timer = 30;


		socket.on('start', function(user){
		
		});
		
		
		var keyAngle = 0;
		
	
		
		socket.on('mouse moved', function(angle1){
			angle = angle1;

		});


		socket.on('key angle', function(angle2){
			keyAngle = angle2;

		});

		socket.on('mouse pressed', function(mouseFlag1){
			mouseFlag = mouseFlag1;
		});

		socket.on('key pressed', function(keyFlag1){
			keyFlag = keyFlag1;
		});

		socket.on('obstacle1', function(x,y,r,speedX,speedY){
			myObstacle1.push( new component(x, y, r, "#9FD175", speedX, speedY, "obstacles"));		
		});

		socket.on('obstacle2', function(x,y,r,speedX,speedY){
			myObstacle2.push( new component(x, y, r, "#DFF", speedX, speedY, "obstacles"));		
		});


		var rocket;
		function startGame() {
			socket.emit("start",0);

		    myGameArea.start();

			rocket= new component(-40, -40, 0, "rocket1.png", 80, 80, "rocket");
			rocket2 = new component(-40, -40, 0, "rocket2.png", 80, 80, "rocket2");

			myScore1 = new component("30px", "Consolas",0, "white", 10, 530, "text");
			myScore2 = new component("30px", "Consolas",0, "white", 750, 50, "text");
			timer = new component("30px", "Consolas",0, "white", 10 , 50, "text");
		}

		var myGameArea = {
		    canvas : document.createElement("canvas"),
		    start : function() {
		        this.canvas.width = 900;
		        this.canvas.height = 550;
		        this.context = this.canvas.getContext("2d");
		        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		        this.frameNo = 0;
		    	this.interval = setInterval(updateGameArea, 20);
		    },
		    clear : function() {
		        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		    }
		}

		function component(x, y, r ,  color, speedX, speedY, type) {
			this.type = type;
			if (this.type == "text") {
				
				this.x = x;
				this.y = y;
				this.color = color;
				this.speedX = speedX;
				this.speedY = speedY;

			} else {
				this.x = x;
				this.y = y; 
				this.r = r;
				this.color = color;
				this.speedX = speedX;
				this.speedY = speedY;
				this.angle = angle;
				this.keyAngle = keyAngle;	
				this.acc = 0.5;
				if(type == "missile") {
					this.speedY = 0;
				}
				if(type == "missile1") {
					this.speedY = 0;
				}

			}
		  
		    


		    this.update = function(){
				ctx = myGameArea.context;
				if( type == "obstacles") {
					
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
					ctx.stroke();
					ctx.fillStyle = this.color;
					ctx.fill();
				}

				if (this.type == "text") {
				      ctx.font = this.x+ " " + this.y;
				      ctx.fillStyle = this.color;
				      ctx.fillText(this.text, this.speedX, this.speedY);
				} 

				if( type == "rocket") {
					this.width = speedX;
					this.height = speedY;
					this.image = new Image();
					this.image.src = color;

					ctx.save();
					ctx.translate(450, 450); 
					
					
					ctx.rotate(angle - 1.5* Math.PI);
					ctx.drawImage(this.image, this.x,this.y,this.width, this.height);
					ctx.restore(); 
				
				}

				if( type == "rocket2") {
					this.width = speedX;
					this.height = speedY;
					this.image = new Image();
					this.image.src = color;

					ctx.save();
					ctx.translate(450, 100); 
					
					
					ctx.rotate(keyAngle - 1.5* Math.PI);
					ctx.drawImage(this.image, this.x,this.y,this.width, this.height);
					ctx.restore(); 
				
				}

				if( type == "missile") {
					this.width = speedX;
					this.height = speedY;
					this.image = new Image();
					this.image.src = color;	
					this.speedY -= this.acc;
					this.speedX = 0;
						

					ctx.save();
					ctx.translate(450, 450); 

					ctx.rotate(this.angle - 1.5* Math.PI);
					ctx.drawImage(this.image, this.x,this.y,this.width, this.height);
					ctx.restore();	
				}

				if( type == "missile1") {
					this.width = speedX;
					this.height = speedY;
					this.image = new Image();
					this.image.src = color;	
					this.speedY += this.acc;
					this.speedX = 0;
						

					ctx.save();
					ctx.translate(450,100); 

					ctx.rotate(this.keyAngle - 1.5* Math.PI);
					ctx.drawImage(this.image, this.x,this.y,this.width, this.height);
					ctx.restore();	
				}
		    }

		    this.crashWith = function(otherobj) {
		            var dis = 0;
		            this.actualX = 450 - this.y*Math.cos( this.angle );
		            this.actualY = 450 - this.y *Math.sin( this.angle );
		    		//alert(this.actualX + ":" + this.actualY);
		            dis = Math.sqrt( (this.actualY - otherobj.y)*(this.actualY - otherobj.y) + (this.actualX  - otherobj.x)*(this.actualX  - otherobj.x));
		            var crash = false;
		            if(dis <= otherobj.r) {
		            	crash = true;
		            }
		            
		            return crash;
		    } 

		    this.crashWith1 = function(otherobj) {
		            var dis = 0;
		            this.actualX = 450 - this.y*Math.cos( this.keyAngle );
		            this.actualY = 100 - this.y *Math.sin( this.keyAngle );
		    		//alert(this.actualX + ":" + this.actualY);
		            dis = Math.sqrt( (this.actualY - otherobj.y)*(this.actualY - otherobj.y) + (this.actualX  - otherobj.x)*(this.actualX  - otherobj.x));
		            var crash = false;
		            if(dis <= otherobj.r) {
		            	crash = true;
		            }
		            
		            return crash;
		    } 

		    this.newPos = function() {
		            this.x += this.speedX;
		            this.y += this.speedY; 
		    }
		}

		

		function updateGameArea() {
		    myGameArea.clear();
		    myGameArea.frameNo = (myGameArea.frameNo + 1)%1000000;



		    /* background */
		    if (myGameArea.frameNo == 1 || myGameArea.frameNo%1 == 0) {
		        x = Math.random()*1100 - 200;
		        y = 0;
		        r = Math.random()*1+0.1;
		        speedX = 0;
		        speedY = 2;
				stars.push( new component(x, y, r, "white", speedX, speedY, "obstacles"));
		    }
		    for (i = 0; i < stars.length; i += 1) {

		        stars[i].newPos();
		        stars[i].update();
		    }

		    /* obstacle1 */

		    if ( myGameArea.frameNo== 1 ||myGameArea.frameNo%300 == 0) {
		        x = Math.random()*900;
		        y = 0;
		        r = 30;
		        speedX = Math.random()*.1;
		        speedY = 0.5;

				socket.emit("obstacle1", x,y,r,speedX,speedY);


			//	myObstacle1.push( new component(x, y, r, "#9FD175", speedX, speedY, "obstacles"));

		    }
		    for (i = 0; i < myObstacle1.length; i += 1) {

		        myObstacle1[i].newPos();
		        myObstacle1[i].update();
		        

		    }

		    /*  obstacle2   */

		    if ( myGameArea.frameNo%450 == 0) {
		        x = Math.random()*900;
		        y = 550;
		        r = 25;
		        speedX = Math.random()*.1;
		        speedY = -0.5;

				socket.emit("obstacle2", x,y,r,speedX,speedY);

				//myObstacle2.push( new component(x, y, r, "red", speedX, speedY, "obstacles"));
		    }
		    for (i = 0; i < myObstacle2.length; i += 1) {

		        myObstacle2[i].newPos();
		        myObstacle2[i].update();
		        
		    }

		    /* obstacle3 */
/*
		    if ( myGameArea.frameNo%200 == 0) {
		        x = Math.random()*900;
		        y = 0;
		        r = 20;
		        speedX = Math.random()*.1;
		        speedY = 0.5;
				myObstacle3.push( new component(x, y, r, "#0788A3", speedX, speedY, "obstacles"));

		    }
		    for (i = 0; i < myObstacle3.length; i += 1) {

		        myObstacle3[i].newPos();
		        myObstacle3[i].update();
		        
		    }
		    */
			rocket.update();
			rocket2.update();
			myScore1.text="SCORE: " +score1;
			myScore1.update();
			myScore2.text="SCORE: " + score2;
			myScore2.update();

			timer.text="TIME LEFT: " + (30 - Math.floor(myGameArea.frameNo/50)) ;
			if((30 - Math.floor(myGameArea.frameNo/50)) == 0) {
				if(score2 > score1) {
					winner = new component("50px", "Consolas",0, "green", 330 , 270, "text");
					winner.text = "GREEN WINS!";
					winner.update();
				} else if( score1 > score2){
					winner = new component("50px", "Consolas",0, "blue", 330 , 270, "text");
					winner.text = "BLUE WINS!";
					winner.update();

				} else {
					winner = new component("50px", "Consolas",0, "white", 330 , 270, "text");
					winner.text = "IT'S A TIE!";
					winner.update();

				}
				clearInterval(myGameArea.interval);
			}
			timer.update();

			if(mouseFlag == 1) {
				mouseFlag = 0;
				missile.push( new component(-5,0,0 , "missile.png", 10,30,"missile"));
			}
		    for (i = 0; i < missile.length; i += 1) {
		    	missile[i].newPos();
				missile[i].update();
		    }

		    if(keyFlag == 1) {
				keyFlag = 0;
				missile1.push( new component(-5,0,0 , "missile1.png", 10,30,"missile1"));
			}
		    for (i = 0; i < missile1.length; i += 1) {
		    	missile1[i].newPos();
				missile1[i].update();
		    }



		    /*checking  collision */

		    for (i = 0; i < missile.length; i += 1) {
		    	for(j = 0; j < myObstacle1.length ; j++) {
		    		if (missile[i].crashWith(myObstacle1[j])) {
		    			score1 ++;

		    		    missile.splice(i,1);
		    		    myObstacle1.splice(j,1);
		    		    break;
		    		}
		    	} 
		    	for(j = 0; j < myObstacle2.length ; j++) {
		    		if (missile[i].crashWith(myObstacle2[j])) {
		    			score1 ++;
		    		    missile.splice(i,1);
		    		    myObstacle2.splice(j,1);
		    		    break;
		    		}
		    	} 
		    }

		    for (i = 0; i < missile1.length; i += 1) {
		    	for(j = 0; j < myObstacle1.length ; j++) {
		    		if (missile1[i].crashWith1(myObstacle1[j])) {
		    			score2 ++;
		    		    missile1.splice(i,1);
		    		    myObstacle1.splice(j,1);
		    		    break;
		    		}
		    	} 
		    	for(j = 0; j < myObstacle2.length ; j++) {
		    		if (missile1[i].crashWith1(myObstacle2[j])) {
		    			score2 ++;
		    		    missile1.splice(i,1);
		    		    myObstacle2.splice(j,1);
		    		    break;
		    		}
		    } 

		    	/*
		    	for(j = 0; j < myObstacle3.length ; j=j+2) {
		    		if (missile[i].crashWith(myObstacle3[j])) {
		    		    missile.splice(i,1);
		    		    myObstacle3.splice(j,1);
		    		    break;
		    		}
		    	}   */        
		    }

		    /* popping */

		    for (i = 0; i < missile.length; i += 1) {
		    		if(missile[i].actualX < 0 || missile[i].actualX > 900 || missile[i].actualY <0 || missile.actualY > 550) {
		    		    missile.splice(i,1);
		    		}
		    }

		    for (i = 0; i < myObstacle1.length; i += 1) {
		    		if( myObstacle1.y > 550) {
		    		    myObstacle1.splice(i,1);
		    		}
		    }

		    for (i = 0; i < myObstacle2.length; i += 1) {
		    		if(myObstacle2.y> 550) {
		    		    myObstacle2.splice(i,1);
		    		}
		    }

		    /*for (i = 0; i < myObstacle3.length; i += 1) {
		    		if(myObstacle3.y> 550) {
		    		    myObstacle3.splice(i,1);
		    		}
		    }*/

	}

		function getMouse( evt ) {
				if( !evt ) evt = window.event;
				
				tempX = event.clientX ;
				tempY = event.clientY ;
				angle = Math.atan2((500 - tempY),(680 - tempX) ) ;
				
				if(angle < Math.PI)
				{
					angle =  (angle) + Math.PI;
				} else {
					angle -= Math.PI;
				}
				socket.emit("mouse moved", angle);
		}
		function fireMissile(evt) {
				if( !evt ) evt = window.event;
				mouseFlag = 1;
				socket.emit("mouse pressed", mouseFlag);

		}			

		function fireMissile2(evt) {
				if( !evt ) evt = window.event;

				keyPressed = evt.keyCode;
				console.log(keyPressed);

				if(keyPressed == 32) {
					keyFlag = 1;
				} else if(keyPressed == '37') {
					keyAngle += 0.3;
				} else if(keyPressed == '39') {
					keyAngle -= 0.3;
				}
					

				socket.emit("key angle", keyAngle);
				socket.emit("key pressed", keyFlag);

		}			

		document.onmousemove = getMouse;
		document.onmousedown = fireMissile;
		document.onkeydown = fireMissile2;
	