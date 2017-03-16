var app = angular.module('shrooms');

app.controller('BoardController', function($scope){
    var GRID_WIDTH = 20;
    var GRID_HEIGHT = 20;
    var EMPTY = "EMPTY";
    var GRASS = "GRASS";
    var SHROOM = "SHROOM";

    $scope.grid = [];
    for(var i = 0; i < GRID_HEIGHT; i++){
        var g = [];
        for(var j = 0; j < GRID_WIDTH; j++){
            g.push(EMPTY);
        }
        $scope.grid.push(g);
    }

    $scope.sheepX = 4.0;
    $scope.sheepY = 5.0;
    var speed = 1.0;
    var SPEED_INCREASE = 1.2;

    var forEach = function(f){
        for(var i = 0; i < GRID_HEIGHT; i++){
            for(var j = 0; j < GRID_WIDTH; j++){
                f(i, j);
            }
        }
    };

    var generateGrass = function(n){
        var empties = [];
        forEach(function(i, j){
            if($scope.grid[i][j] == EMPTY){
                empties.push([i, j]);
            }
        });
        shuffle(empties);
        for(var i = 0; i < n; i++){
            var t = empties[i];
            $scope.grid[t[0]][t[1]] = GRASS;
        }
    };

    generateGrass(5);

    var mouseInfo = {x: 0.0, y: 0.0};
    $(document).mousemove(function(e) {
        mouseInfo.x = e.pageX;
        mouseInfo.y = e.pageY;
    }).mouseover();

    var computeCollision = function(){
        var x = Math.floor($scope.sheepX);
        var y = Math.floor($scope.sheepY);
        var res = [];
        res.push([x, y]);
        //todo : make it correct
        return res;
    };

    var fetchCoordinates = function(){
        var pos = $(".sheep").offset();
        var x = mouseInfo.x - pos.top;
        var y = mouseInfo.y - pos.left;
        console.debug(mouseInfo.x + " " + pos.top + " " + mouseInfo.y + " " + pos.left);
        var norm = x * x + y * y;
        if(norm == 0.0) norm = 1.0;
        x *= speed / norm;
        y *= speed / norm;
        return [$scope.sheepX + x, $scope.sheepY + y];
    };

    var refresh = 50;
    $scope.score = 0;
    /* Paint loop */
    setInterval(function(){

        var coords = fetchCoordinates();
        $scope.sheepX = coords[0];
        $scope.sheepY = coords[1];
        for(var col in computeCollision()){
            if($scope.grid[col[0]][col[1]] == GRASS){
                $scope.grid[col[0]][col[1]] == EMPTY;
                $scope.score++;
            } else if($scope.grid[col[0]][col[1]] == SHROOM){
                $scope.grid[col[0]][col[1]] == EMPTY;
                $scope.score+=5;
                generateGrass(5);
                speed *= SPEED_INCREASE;
            }
        }



        $scope.$apply();
    }, refresh);

});