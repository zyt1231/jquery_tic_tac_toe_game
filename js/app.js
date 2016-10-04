/**
 * Created by Ting on 10/1/16.
 */
/*
 * Player vs Computer
 * Player goes first with O mark,
 * Computer with X mark.
 *
 * */


MARK_HUMAN_PLAYER = 'X';
MARK_COMPUTER = 'O';
MARK_EMPTY = 'E';
BOARD_SIZE = 3; // 4 by 4 board
BOARD = new Array(BOARD_SIZE);
TILE_HEIGH = 550 / BOARD_SIZE;
TILE_WIDTH = 550 / BOARD_SIZE;
WIN_TILES = [];


var App = function () {
    this.init();
}

App.prototype.init = function () {
    //initialize board
    var $div = $("<div>", {id: "box"});
    $("body").append($div);
    for (var i = 1; i <= BOARD_SIZE; i++) {
        BOARD[i] = new Array(BOARD_SIZE);
        for (var j = 1; j <= BOARD_SIZE; j++) {
            BOARD[i][j] = new Tile();
            BOARD[i][j].i = i;
            BOARD[i][j].j = j;
            var $div = $("<div>", {id: "tile-" + i + "-" + j, "class": "tile"}).height(TILE_HEIGH).width(TILE_WIDTH);
            $div.append($("<font>", {"class": "mark", "color": "#FFFFFF"}));
            //click listener
            $div.click(function () {
                game.click(this);
            })
            $("#box").append($div);
        }
    }
    //initialize restart game button
    $("#box").append($("<button>", {id: "restart-btn", text: "RESTART GAME"}));
    $("#restart-btn").click(function () {
        game.restart();
    });
    //initialize combo box to choose game board size
    var $s = $('<select />', {id: "size"});
    for (i = 3; i <= 10; i++) {
        $s.append($('<option />', {value: i, text: i + ' X ' + i}));
    }
    $("body").append($s);
    $s.change(function () {
        BOARD_SIZE = parseInt($("#size").find('option:selected').val());
        TILE_HEIGH = 550 / BOARD_SIZE;
        TILE_WIDTH = 550 / BOARD_SIZE;

        game.render();
        console.log(BOARD_SIZE);
    })
    //initialize result notice
    $("body").append($("<P>", {id: "result", text: "?"}));
}

App.prototype.render = function () {
    $(".tile").remove();
    $("#restart-btn").remove();
    BOARD = [];
    for (var i = 1; i <= BOARD_SIZE; i++) {
        BOARD[i] = new Array(BOARD_SIZE);
        for (var j = 1; j <= BOARD_SIZE; j++) {
            BOARD[i][j] = new Tile();
            BOARD[i][j].i = i;
            BOARD[i][j].j = j;
            var $div = $("<div>", {id: "tile-" + i + "-" + j, "class": "tile"}).height(TILE_HEIGH).width(TILE_WIDTH);
            $div.append($("<font>", {"class": "mark", "color": "#FFFFFF"}));
            //click listener
            $div.click(function () {
                game.click(this);
            })
            $("#box").append($div);
        }
    }
    //render restart game button
    $("#box").append($("<button>", {id: "restart-btn", text: "RESTART GAME"}));
    $("#restart-btn").click(function () {
        game.restart();
    });
}

App.prototype.click = function (div) {
    console.log("clicked tile id: " + div.id);
    i = div.id.split("-")[1];
    j = div.id.split("-")[2];
    if (BOARD[i][j].mark == MARK_EMPTY) {
        BOARD[i][j].mark = MARK_HUMAN_PLAYER;
        console.log("After click This tile status is:" + BOARD[i][j]);
        div.firstChild.innerText = MARK_HUMAN_PLAYER;
        console.log("id: " + div.id);
        //check if win
        var win = game.ifWin(i, j, MARK_HUMAN_PLAYER);
        if (win) {
            WIN_TILES.forEach(function (entry) {
                entry.mark_color('red');
            })
            game.endGame(MARK_HUMAN_PLAYER);
            return
        }
        console.log(win);
        //computer turn
        var tile = game.randomMark();
        //check if win
        var win = game.ifWin(tile.i, tile.j, MARK_COMPUTER);
        if (win) {
            WIN_TILES.forEach(function (entry) {
                entry.mark_color('red');
            })
            game.endGame(MARK_COMPUTER);
            return
        }
    }
}

App.prototype.restart = function () {
    console.log("restart button clicked.");
    BOARD.forEach(function (entry) {
        entry.forEach(function (cell) {
            cell.mark = MARK_EMPTY;
            cell.mark_html("");
            console.log(cell.mark);
        })
    })
    $(".tile").click(function () {
        game.click(this);
    })
    $("#result").text("?");
    WIN_TILES.forEach(function (entry) {
        entry.mark_color('white');
    })
};


App.prototype.endGame = function (mark) {
    $("#result").text(mark + " win !");
    $(".tile").unbind("click");
}

App.prototype.ifWin = function (i, j, mark) {
    //check row
    for (k = 1; k <= BOARD_SIZE; k++) {
        if (BOARD[k][j].mark != mark) {
            WIN_TILES = [];
            break;
        }
        WIN_TILES.push(BOARD[k][j]);
        if (k == BOARD_SIZE) {
            return true //win
        }
    }
    //check column
    for (k = 1; k <= BOARD_SIZE; k++) {
        if (BOARD[i][k].mark != mark) {
            WIN_TILES = [];
            break;
        }
        WIN_TILES.push(BOARD[i][k]);
        if (k == BOARD_SIZE) {
            return true //win
        }
    }
    //check diagonal
    if (i == j) {
        for (k = 1; k <= BOARD_SIZE; k++) {
            if (BOARD[k][k].mark != mark) {
                WIN_TILES = [];
                break;
            }
            WIN_TILES.push(BOARD[k][k]);
            if (k == BOARD_SIZE) {
                return true //win
            }
        }
    }
    //check anti diagnal
    if (i + j == BOARD_SIZE + 1) {
        for (k = 1; k <= BOARD_SIZE; k++) {
            if (BOARD[k][(BOARD_SIZE + 1) - k].mark != mark) {
                WIN_TILES = [];
                break;
            }
            WIN_TILES.push(BOARD[k][(BOARD_SIZE + 1) - k]);
            if (k == BOARD_SIZE) {
                return true //win
            }
        }
    }
    return false
}


App.prototype.randomMark = function () {
    var emptyTiles = [];
    BOARD.forEach(function (row) {
        row.forEach(function (cell) {
            if (cell.mark == MARK_EMPTY) {
                emptyTiles.push(cell);

            }
        })
    })
    if (emptyTiles.length > 0) {
        var randomNum = Math.floor(Math.random() * (emptyTiles.length)); // 0-8
        emptyTiles[randomNum].mark = MARK_COMPUTER;
        emptyTiles[randomNum].mark_html(MARK_COMPUTER);
        return emptyTiles[randomNum];
    }
}


var Tile = function () {
    this.mark = MARK_EMPTY; //status could be X, O and E
    this.i;
    this.j;
    // console.log('I am a tile !')
}


Tile.prototype.mark_html = function (input) {
    $("#tile-" + this.i + "-" + this.j).find("font").text(input);
    console.log(this.i);
}
Tile.prototype.mark_color = function (color) {
    $("#tile-" + this.i + "-" + this.j).find("font").attr('color', color);
    console.log(this.i);
}

// main
game = new App();


