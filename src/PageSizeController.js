import CallbackDispatcher from './core/util/CallbackDispatcher';

class PageSizeController extends CallbackDispatcher {
    constructor () {
        super();

        this.handleWindowResized = this.handleWindowResized.bind(this);

        window.addEventListener("resize", this.handleWindowResized);
        document.addEventListener("ready", this.handleWindowResized);
    }

    handleWindowResized() {
        let newWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        let newHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        this.dispatch({size: {width: newWidth, height: newHeight}});
    }
}

const pageSizeController = new PageSizeController();
export default pageSizeController;