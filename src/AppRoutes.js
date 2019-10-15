import HomePage from './pages/home/HomePage';
import DataSetPage from './pages/dataSet/DataSetPage';

const Base_Routes = [
    {url: "/", icon: "fas fa-home", label: "Home", component: HomePage, params: {exact: true}},
    {url: "/dataSet", icon: "fas fa-table", label: "Data Set", component: DataSetPage, params: {exact: true}}
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


