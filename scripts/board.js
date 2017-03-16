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

    $scope.sheepX = 0.0;
    $scope.sheepY = 0.0;

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

});