import {useEffect} from "react";
import {Provider, useDispatch} from "react-redux";
import {RouterProvider} from "react-router-dom";

import {store} from "./redux/store.js"
import router from "./router/router.js";
import {useCheckAuthQuery} from "./services/api/authApi.js";
import {oauth} from "./redux/auth/authSlice.js";
import Loader from "./components/Loader/Loader.jsx";

function App() {
    const dispatch = useDispatch();
    const { data, isSuccess, isLoading} = useCheckAuthQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    useEffect(() => {
        if (isSuccess) {
            dispatch(oauth(data));
        }
    }, [isSuccess, data, dispatch]);

    return (
        <>
            <Provider store={store}>
                {isLoading
                    ?
                    <Loader/>
                    :
                    <RouterProvider router={router}/>
                }
            </Provider>
        </>

    )
}

export default App
