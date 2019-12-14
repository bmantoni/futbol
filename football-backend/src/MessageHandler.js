class MessageHandler {
    constructor() {
        //this.parse = this.parse
    }

    parse(msg) {
        var obj = JSON.parse(msg);
        // validate
        return obj;
    }
}

module.exports = MessageHandler;