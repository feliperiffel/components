import HomePage from './pages/home/HomePage';
import DataSetPage from './pages/dataSet/DataSetPage';
import DynamicScrollPage from "./pages/dynamicScroll/DynamicScrollPage";

const Base_Routes = [
    {url: "/", icon: "fas fa-home", label: "Home", component: HomePage, params: {exact: true}},
    {url: "/dataSet", icon: "fas fa-table", label: "Data Set", component: DataSetPage, params: {exact: true}},
    {url: "/dynamicScroll", icon: "fas fa-stream", label: "Dynamic Scroll", component: DynamicScrollPage, params: {exact: true}}
];

class AppRoutes {

    constructor(props) {
        this.getRoutes = this.getRoutes.bind(this);
    }

    getRoutes() {
        return Base_Routes;
    }

}

const appRoutes = new AppRoutes();
export default appRoutes;


