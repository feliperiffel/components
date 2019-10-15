import createBrowserHistory from 'history/createBrowserHistory'

const customHistory = createBrowserHistory({forceRefresh: false});
export default customHistory;