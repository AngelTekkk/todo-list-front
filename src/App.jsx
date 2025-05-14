import {Provider} from "react-redux";
import {RouterProvider} from "react-router-dom";

import {store} from "./redux/store.js"
import router from "./router/router.js";
import Container from "./components/Container/Container.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AuthChecker from "./components/AuthChecker/AuthChecker.js";

function App() {
    return (
        <Provider store={store}>
            <AuthChecker />
            <Container>
                <Header />
                <RouterProvider router={router} />
                <Footer />
            </Container>
        </Provider>
    )
}

export default App
