import {useEffect} from "react";
import {useDispatch} from "react-redux";

import {useCheckAuthQuery} from "../../services/api/authApi.js";
import {setUser} from "../../redux/auth/authSlice.js";

function AuthChecker() {
    const dispatch = useDispatch();
    const { data, isSuccess } = useCheckAuthQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    useEffect(() => {
        if (isSuccess) {
            dispatch(setUser(data.user));
        }
    }, [isSuccess, data, dispatch]);

    return null;
}

export default AuthChecker;