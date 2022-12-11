// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logoutUser } from '../../store/session';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const logout = e => {
        e.preventDefault();
        dispatch(logoutUser());
    }

    return (
        <ul className="nav">
            <NavLink className="nav-item" to="/">
                Home
            </NavLink>
            {!sessionUser && (
                <>
                    <LoginFormModal />
                    <NavLink to="/signup" className="nav-item">
                        Sign Up
                    </NavLink>
                </>
            )}

            {sessionUser && (
                <>
                    <ProfileButton />
                    <button
                        id="logout-btn"
                        onClick={e => logout(e)}
                    >
                        Log Out
                    </button>
                </>
            )}
        </ul>
    );
}

export default Navigation;