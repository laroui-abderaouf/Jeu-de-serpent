window.onload = function () {


    var canvasWidth = 900;
    var canvasHeight = 560;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;

    init(); // excuter la fonction init

   
   
   
    function init() {
        var canvas = document.createElement('canvas');// canvas c'est la bordure de la page html
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // CSS
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";





        document.body.appendChild(canvas); // on attaché notre canvas a notre page HTML (document c'est la page html)
        ctx = canvas.getContext('2d'); // dommaine de definition
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right"); // initialisation du serpent
        applee = new Apple([10, 10]); // dessiner la pomme
        score = 0;
        refreshCanvas(); // appeler la fonction refreshCanvas
    }

    
    
    
    function refreshCanvas() {
        snakee.advance();
        if (snakee.chekCollision()) {
            gameOver(); // excution de la fonction gameOver
        }
        else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;

                do {
                    applee.setNewPosition();
                }
                while (applee.isOnSnake(snakee))

            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // supprimer le rectangle d'avant
            drawScore();
            snakee.draw();
            applee.draw();
            

            setTimeout(refreshCanvas, delay); // refaire le processus de refreshCanvas chaque expiration du delay


        }


    }

    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 60px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;

        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180); // ajouter un text

        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function restart()
    {
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right"); 
        applee = new Apple([10, 10]); 
        score =0;
        refreshCanvas(); 
    }

    function drawScore()
    {
        ctx.save();

        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;

        
        ctx.fillText(score.toString(), centreX, centreY); // ajouter un text
       
        ctx.restore();

    }





   
   
    function drawBloc(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);


    }

    
    
    
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;

        this.ateApple = false ;

        this.draw = function () {
            // sauvegarder ce qu'on avait avant
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {

                drawBloc(ctx, this.body[i]);
            }
            // il permet de garder le context comme il était avant
            ctx.restore();


        };

        this.advance = function () {
            var nextPosition = this.body[0].slice(); // copier l'element
            switch (this.direction)
            // modifier la position x de la 1ere valeur de l'array
            {
                case "left":
                    nextPosition[0] -= 1; // la verticale
                    break;
                case "right":
                    nextPosition[0] += 1; // la verticale
                    break;
                case "down":
                    nextPosition[1] += 1; // horizental
                    break;
                case "up":
                    nextPosition[1] -= 1; // horizental
                    break;
                default:
                    throw ("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop(); // supprimer la derniere position de l'array
            else
                this.ateApple = false;
        };


        // passer la direction au serpent
        this.setDerection = function (newDirection) {
            var alloweDirections;

            switch (this.direction) {
                case "left":
                case "right":
                    alloweDirections = ["up", "down"]; // les directions permisent 
                    break;
                case "down":
                case "up":
                    alloweDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalid Direction");

            }

            if (alloweDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.chekCollision = function () {

            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0]; // juste la tete du serpernt 
            var rest = this.body.slice(1); // le reste du serpent
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizentalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizentalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++) {

                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }

            }
            return wallCollision || snakeCollision;



        };


        this.isEatingApple = function (appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])

                return true;

            else
                return false;
        };

    }


    
    
    
    function Apple(position) {

        this.position = position;
        this.draw = function () {
            ctx.save(); // enregistrer nos parametres d'avant
            ctx.fillStyle = "#33cc33"; // couleur de la pomme
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true); // dessiner le cercle
            ctx.fill(); // remplire le cercle
            ctx.restore(); // il mis a jour les parametres
        };

        this.setNewPosition = function () {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };

        // resoudre le probleme de la pomme sur le serpent
        this.isOnSnake = function (snakeToCheck) {
            var isOnSnake = false;

            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }







    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        // guider le serpent avec les fleches du clavier
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDerection(newDirection);

    }









}