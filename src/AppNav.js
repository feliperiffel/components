import React from 'react';
import {NavLink} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import BoundComponent from "./core/BoundComponent";
import './AppNav.css'
import PageSizeController from "./PageSizeController";

class AppNav extends BoundComponent {
    constructor(props) {
        super(props);

        this.navRef = undefined;
        this.state = {
            open: false,
            hover: false,
            size: props.size
        }
    }

    handlePageResize(e) {
        this.setState(e);
    }

    componentDidMount() {
        PageSizeController.subscribe("appNav", this.handlePageResize);
    }

    componentWillUnmount() {
        PageSizeController.unsubscribe("appNav");
    }

    handleMouseClick(e) {

    }

    render() {

        let navItems = [];
        AppRoutes.getRoutes().forEach((item) => {

            let icon = "";
            if (item.icon) {
                icon = <div className={"icon " + item.icon}/>;
            }
            navItems.push(
                <span key={navItems.length}>
                    <NavLink exact to={item.url} activeClassName="selected">
                        {icon} {item.label}
                    </NavLink>
                </span>
            )
        });

        return (
            <nav id="app-nav"
                 style={{height: (this.state.size.height - 150) + "px"}}
                 ref={(ref) => {
                     this.navRef = ref
                 }}
                 onClick={this.handleMouseClick}
                 onMouseEnter={() => {
                     this.setState({hover: true})
                 }}
                 onMouseLeave={() => {
                     this.setState({hover: false})
                 }}
                 className={"main-menu" + (this.state.hover ? " open" : "")}>

                {navItems}
            </nav>
        )
    }
}

export default AppNav;