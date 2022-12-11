// frontend/src/components/SignupFormPage/index.js
import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { signupUser } from '../../store/session';

function SignupFormPage() {
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) return (
        <Redirect to="/" />
    );

    const submitHandler = e => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setErrors(['Passwords do not match.']);
        }

        setErrors([]);

        const user = {
            email,
            username,
            password
        }
        return dispatch(signupUser(user))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    }

    return (
        <form onSubmit={e => submitHandler(e)}>
            {/* For any possible errors */}
            <ul>
                {errors.map((error, i) => <li key={i} className="error-message">
                    {error}
                </li>)}
            </ul>

            <input
                placeholder="Username"
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />
            <input
                placeholder="Email"
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Password"
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <input
                placeholder="Confirm password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupFormPage;