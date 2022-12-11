import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import "./Navigation.css";

function ProfileButton() {
    const [showMenu, setShowMenu] = useState(false);
    const sessionUser = useSelector(state => state.session.user);

    const openMenu = () => {
        if (!showMenu) {
            setShowMenu(true);
        }
    }

    useEffect(() => {
        if (showMenu) {
            const closeMenu = () => {
                setShowMenu(false);
            }

            document.addEventListener('click', closeMenu);

            return () => document.removeEventListener('click', closeMenu);
        }
    }, [showMenu]);

    return (
        <>
            <button
                id="profile-btn"
                onClick={openMenu}
            >
                <i className="fa-solid fa-user"></i>
            </button>

            {/* Dropdown menu */}
            {
                showMenu && (
                    <ul className="profile-dropdown">
                        <li>{sessionUser.username}</li>
                        <li>{sessionUser.email}</li>
                    </ul>
                )
            }
        </>
    );
}

export default ProfileButton;