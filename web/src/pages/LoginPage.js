import React from 'react';
import Login from '../components/Login';

const LoginPage = ({ setUsername }) => {
    return (
        <div className="container mx-auto px-4">
            <Login setUsername={setUsername} />
        </div>
    );
};

export default LoginPage;
