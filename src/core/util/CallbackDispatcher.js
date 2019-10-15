export default class CallbackDispatcher {

    constructor(){
        this.subscriptions = {};

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.dispatch = this.dispatch.bind(this);
    }

    subscribe(uuid, callback) {
        this.subscriptions[uuid] = callback;
    }

    unsubscribe(uuid) {
        delete this.subscriptions[uuid];
    }

    dispatch(event) {
        let invalidSubscriptions = [];
        Object.entries(this.subscriptions).forEach((entry) => {
            let uuid = entry[0];
            let callback = entry[1];

            if (callback && typeof callback === "function") {
                callback(event);
            } else {
                invalidSubscriptions.push(uuid);
            }
        }, this);

        invalidSubscriptions.forEach((uuid) => {
            delete this.subscriptions[uuid];
        }, this)
    }
}