import CallbackDispatcher from './core/util/CallbackDispatcher';

class PageSizeController extends CallbackDispatcher {

    constructor () {
        super();

        this.size = {width: 0, height: 0};

        this.handleWindowResized = this.handleWindowResized.bind(this);

        window.addEventListener("resize", this.handleWindowResized);
        document.addEventListener("ready", this.handleWindowResized);
        this.handleWindowResized();
    }

    getCurrentPageSize() {
        return this.size;
    }

    handleWindowResized() {
        let newWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        let newHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        this.size = {width: newWidth, height: newHeight};
        this.dispatch({size: this.size});
    }
}

const pageSizeController = new PageSizeController();
export default pageSizeController;