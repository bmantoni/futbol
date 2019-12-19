class MessageHandler {
    static ACTIONS = ['I'];
    static DIRECTIONS = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    parse(msg) {
        var obj = JSON.parse(msg);
        this.validateMessage(obj);
        
        this.addDirectionHelperMethods(obj);
        return obj;
    }

    validateMessage(obj) {
        if (!obj.player) {
            throw new Error('Missing player');
        }
        if (isNaN(obj.player)) {
            throw new Error('Invalid player');
        }
        if (!obj.action) {
            throw new Error('Missing action');
        }
        if (!MessageHandler.ACTIONS.includes(obj.action)) {
            throw new Error('Invalid action');
        }
        if (!obj.direction) {
            throw new Error('Missing direction');
        }
        if (!MessageHandler.DIRECTIONS.includes(obj.direction)) {
            throw new Error('Invalid direction');
        }
    }

    addDirectionHelperMethods(obj) {
        obj.isUp = () => obj.direction === 'UP';
        obj.isDown = () => obj.direction === 'DOWN';
        obj.isLeft = () => obj.direction === 'LEFT';
        obj.isRight = () => obj.direction === 'RIGHT';
        obj.isPlayer1 = () => obj.player === '1';
        obj.isPlayer2 = () => obj.player === '2';
    }
}

module.exports = MessageHandler;