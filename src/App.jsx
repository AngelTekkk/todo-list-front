import './App.css'

import {Provider} from "react-redux";
import {store} from "./redux/store.js"

import {RouterProvider} from "react-router";
import router from "./router/router.js";

function App() {

    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App
