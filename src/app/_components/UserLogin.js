import React, { useState } from 'react';
import '../style.css';

const UserLogin = () => {
    const [showLogin, setShowLogin] = useState(false);

    const toggleLogin = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div>            
            
                <div className="login-window">
                    <form>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
        </div>
    );
};

export default UserLogin;
