var app = angular.module('shrooms');

app.controller('BoardController', function($scope){
    var GRID_WIDTH = 15;
    var GRID_HEIGHT = 15;
    var GAME_STATES = {
        PAUSED: "PAUSED",
        STARTING: "STARTING",
        PLAYING: "PLAYING",
        LOST: "LOST"
    };
    var TILE_STATES = {
        EMPTY: "EMPTY",
        GRASS: "GRASS",
        SHROOM: "SHROOM"
    };
    var SPEED_INCREASE = 1.1;

    var speed;
    $scope.grid = [];
    for(var i = 0; i < GRID_HEIGHT; i++){
        var g = [];
        for(var j = 0; j < GRID_WIDTH; j++){
            g.push(TILE_STATES.EMPTY);
        }
        $scope.grid.push(g);
    }

    var getShuffledEmpties = function(padding){
        padding = padding || 0;
        var empties = [];
        for(var i = padding; i < GRID_HEIGHT - padding; i++){
            for(var j = padding; j < GRID_WIDTH - padding; j++){
                if($scope.grid[i][j] == TILE_STATES.EMPTY){
                    empties.push([i, j]);
                }
            }
        }
        shuffle(empties);
        return empties;
    };

    var generateGrass = function(n){
        var empties = getShuffledEmpties();
        for(var i = 0; i < n; i++){
            var t = empties[i];
            $scope.grid[t[0]][t[1]] = TILE_STATES.GRASS;
        }
    };

    var generateShroom = function(){
        var c = getShuffledEmpties(3)[0];
        $scope.grid[c[0]][c[1]] = TILE_STATES.SHROOM;
    };

    var initSheep = function(){
        $scope.sheepX = GRID_WIDTH / 2.0;
        $scope.sheepY = GRID_HEIGHT / 2.0;
    };

    var initGame = function(){
         initSheep();
         speed = 0.1;
         generateGrass(5);
         $scope.score = 0;
         $scope.multiplier = 1;
         generateShroom();
    };
    initGame();

    $scope.gameState = GAME_STATES.PAUSED;

    var forEach = function(f){
        for(var i = 0; i < GRID_HEIGHT; i++){
            for(var j = 0; j < GRID_WIDTH; j++){
                f(i, j);
            }
        }
    };

    var mouseInfo = {x: 0.0, y: 0.0};
    $(document).mousemove(function(e) {
        mouseInfo.x = e.pageX;
        mouseInfo.y = e.pageY;
    }).mouseover();

    var computeCollision = function(){
        var x = Math.floor($scope.sheepY);
        var y = Math.floor($scope.sheepX);
        var res = [];
        res.push([x, y]);
        var dx = $scope.sheepY - x;
        var dy = $scope.sheepX - y;
        if(dx < 0.5){
            res.push([x - 1, y]);
        } else {
            res.push([x + 1, y]);
        }
        if(dy < 0.5){
            res.push([x, y - 1]);
        } else {
            res.push([x, y + 1]);
        }
        for(var t = 0; t < 2; t++){
            for(var u = 0; u < 2; u++){
                var dxi = dx - t;
                var dyi = dy - u;
                if(Math.sqrt(dxi * dxi + dyi * dyi) < 1){
                    console.debug("pushing corner", t, u)
                    res.push([x + 2 * i - 1, y + 2 * u - 1,])
                }
            }
        }
        return res.filter(function(t){return t[0] >= 0 && t[1] >= 0 && t[0] < GRID_HEIGHT && t[1] < GRID_WIDTH; });
    };

    var fetchCoordinates = function(){
        var pos = getCoords(document.getElementById("sheep"));
        var x = mouseInfo.x - pos.left;
        var y = mouseInfo.y - pos.top;
        var norm = Math.sqrt(x * x + y * y);
        if(norm == 0.0) norm = 1.0;
        x *= - speed / norm;
        y *= - speed / norm;
        return [$scope.sheepX + x, $scope.sheepY + y];
    };

    var refresh = 50;
    $scope.score = 0;
    /* Paint loop */
    setInterval(function(){
        var coords = fetchCoordinates();
        $scope.sheepX = coords[0];
        $scope.sheepY = coords[1];
        if($scope.sheepX > GRID_WIDTH || $scope.sheepY > GRID_HEIGHT || $scope.sheepX * $scope.sheepY < 0){
            initSheep();
        }
        var collision = computeCollision();
        console.debug($scope.sheepY, $scope.sheepX, collision);
        for(var i = 0; i < collision.length; i++){
            var col = collision[i];
            var x = col[0];
            var y = col[1];
            if($scope.grid[x][y] == TILE_STATES.GRASS){
                $scope.grid[x][y] = TILE_STATES.EMPTY;
                $scope.score += $scope.multiplier;
            } else if($scope.grid[x][y] == TILE_STATES.SHROOM){
                $scope.grid[x][y] = TILE_STATES.EMPTY;
                $scope.score += 5 * $scope.multiplier;
                generateGrass(5);
                $scope.multiplier++;
                speed *= SPEED_INCREASE;
                generateShroom();
            }
        }



        $scope.$apply();
    }, refresh);

});