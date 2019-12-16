class GameState {
    constructor() {
        this.players = []
    }
    join() {
        var num = this.players.length + 1;
        this.players.push(num);
        return num;
    }
    reset() {
        this.players = [];
    }
}

module.exports = GameState;