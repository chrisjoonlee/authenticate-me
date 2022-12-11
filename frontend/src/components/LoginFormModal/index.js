import React, { useState } from 'react';

import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button onClick={() => setShowModal(true)}>
                Log In
            </button>

            {showModal && (
                <Modal onClose={() => setShowModal(false)} children={LoginForm}>
                    <LoginForm></LoginForm>
                </Modal>
            )}
        </>
    );
}

export default LoginFormModal;