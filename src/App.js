import React from 'react';
import './App.css';
import BoundComponent from "./core/BoundComponent";
import '@fortawesome/fontawesome-free/css/all.css';
import PageSizeController from './PageSizeController';
import AppNav from "./AppNav";
import AppRotes from './AppRoutes';
import {Route} from 'react-router-dom';

class App extends BoundComponent {

    constructor(props) {
        super(props);
        let width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        let height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        this.state = {
            size: {width: width, height: height}
        }
    }

    handlePageResize(e) {
        this.setState(e);
    }

    componentDidMount() {
        PageSizeController.subscribe("app", this.handlePageResize);
    }

    componentWillUnmount() {
        PageSizeController.unsubscribe("app");
    }

    render() {
        let routes = [];
        AppRotes.getRoutes().forEach((route) => {
            routes.push(<Route exact path={route.url} component={route.component}/>);
        });

        return (
            <div id="main-app"
                 style={{
                     width: this.state.size.width,
                     height: this.state.size.height
                 }}>
                <header>
                    <h1 className="title is-1">Components</h1>
                </header>
                <div id="main-app-content"
                     style={{
                         height: (this.state.size.height - 150) + "px"
                     }}>
                    <AppNav size={this.state.size}/>
                    <div id="app-content-container"
                         className="scroll_bar"
                         style={{
                             width: (this.state.size.width - 40) + "px",
                             height: (this.state.size.height - 150) + "px"
                         }}>
                        <switch>
                            {routes}
                        </switch>
                    </div>
                </div>
                <footer>

                </footer>
            </div>
        )
    }
}

export default App;
