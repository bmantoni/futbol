class Broadcaster {
    constructor(wsi) {
        this.wsInstance = wsi;
    }
    broadcast(obj) {
        this.wsInstance.getWss().clients.forEach(x => x.send(JSON.stringify(obj)));
    }
}

module.exports = Broadcaster;