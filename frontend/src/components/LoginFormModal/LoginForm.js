// frontend/src/components/LoginFormModal/index.js
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { loginUser } from '../../store/session'
import './LoginForm.css';

function LoginForm() {
    const dispatch = useDispatch();

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const submitHandler = e => {
        e.preventDefault();
        setErrors([]);

        const user = {
            credential,
            password
        }
        return dispatch(loginUser(user))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    }

    return (
        <form onSubmit={e => submitHandler(e)}>
            {/* For any possible errors */}
            <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>

            <input
                placeholder="Username or email"
                id="credential"
                type="text"
                value={credential}
                onChange={e => setCredential(e.target.value)}
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
            <button type="submit">Log In</button>
        </form>
    );
}

export default LoginForm;