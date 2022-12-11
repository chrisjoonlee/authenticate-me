// frontend/src/store/session
import { csrfFetch } from './csrf.js';

const SET_SESSION_USER = 'session/SET_SESSION_USER';
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';

// Action creator for setting a new session user
const setSessionUser = (user) => {
    return {
        type: SET_SESSION_USER,
        user
    }
}

// Action creator for removing a session user
const removeSessionUser = () => {
    return {
        type: REMOVE_SESSION_USER
    }
}

// Thunk creator for GET /api/session
export const restoreUser = () => async dispatch => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;

}

// Thunk creator for POST /api/session
export const loginUser = (user) => async dispatch => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
}

// Thunk creator for DELETE /api/session
export const logoutUser = () => async dispatch => {
    const response = await csrfFetch("/api/session", {
        method: "DELETE"
    });
    dispatch(removeSessionUser());
    return response;
}

// Thunk creator for POST /api/users
export const signupUser = (user) => async dispatch => {
    const { email, username, password } = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            email,
            username,
            password
        })
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
}

const initialState = {
    user: null
};

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_SESSION_USER:
            newState = Object.assign({}, state);
            newState.user = action.user;
            return newState;
        case REMOVE_SESSION_USER:
            return { user: null };
        default:
            return state;
    }
}

export default sessionReducer;