import {Provider} from "react-redux";
import {RouterProvider} from "react-router-dom";

import {store} from "./redux/store.js"
import router from "./router/router.js";
import AuthChecker from "./components/AuthChecker/AuthChecker.js";

function App() {
    return (
        <Provider store={store}>
            <AuthChecker/>
            <RouterProvider router={router}/>
        </Provider>
    )
}

export default App
