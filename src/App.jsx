

import {Provider} from "react-redux";
import {store} from "./redux/store.js"

import {RouterProvider} from "react-router-dom";
import router from "./router/router.js";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {

    return (
        <Provider store={store}>
            <Header />
            <RouterProvider router={router} />
            <Footer />
        </Provider>
    )
}

export default App
