class MessageHandler {
    constructor() {
        //this.parse = this.parse
    }

    parse(msg) {
        var obj = JSON.parse(msg);
        this.validateMessage(obj);
        return obj;
    }

    validateMessage(obj) {
        if (!obj.action) {
            throw new Error('Missing action');
        }
    }
}

module.exports = MessageHandler;