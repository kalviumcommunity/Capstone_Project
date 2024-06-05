// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import LoginImg from '../assests/login.jpg';
import { Link } from 'react-router-dom';
import arrow from '../assests/arrow.png';
import Cookies from 'js-cookie';
import { auth, provider } from '../../firebase-auth/firebase'; // Ensure this path is correct
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

function LoginForm() {
    const [loginUser, setLoginUser] = useState({
        username: "",
        password: "",
        email:""
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState("");

    const handleChange = (e, field) => {
        setLoginUser({ ...loginUser, [field]: e.target.value });
        setValidationErrors({ ...validationErrors, [field]: "" });
    };

    const validateForm = () => {
        const errors = {};
        
        if (!loginUser.username.trim()) {
            errors.username = 'Username is required';
        } else if (loginUser.username.length < 3) {
            errors.username = 'Username should have a minimum length of 3';
        } else if (loginUser.username.length > 30) {
            errors.username = 'Username should have a maximum length of 30';
        }

        if (!loginUser.password.trim()) {
            errors.password = 'Password is required';
        } else if (loginUser.password.length < 6) {
            errors.password = 'Password should have a minimum length of 6';
        } else if (loginUser.password.length > 15) {
            errors.password = 'Password should have a maximum length of 15';
        }
        if (!loginUser.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginUser.email)) {
            errors.email = 'Email is invalid';
        }
        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
    
        const validation = validateForm();
        if (Object.keys(validation).length > 0) {
            setValidationErrors(validation);
            return;
        }
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginUser.email, loginUser.password);
            const user = userCredential.user;
            const response = await axios.post('http://localhost:3000/users/login', {
                username: loginUser.username,
                password: loginUser.password,
                email: loginUser.email
            });
            if (response.status === 200) {
                Cookies.set('loggedIn', 'true');
                Cookies.set('username', loginUser.username);
                window.location.href = '/';
                window.alert('Login successful');
                console.log(response.data);
                console.log(user);
            } else {
                setError('Login failed');
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('User not found');
            } else if (err.response && err.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred while logging in');
                console.error(err);
            }
        }
    };
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            Cookies.set('loggedIn', 'true');
            Cookies.set('username', user.displayName);
            window.location.href = '/';
            window.alert('Google login successful');
            console.log(user);
            await auth.signOut();
        } catch (error) {
            setError('An error occurred while logging in with Google');
            console.error(error);
        }
    };

    return (
        <>
            <Link to="/">
                <img src={arrow} className="back-arrow" alt="back" />
            </Link>
            <div className='login-page'>
                <div className='login-image-section'>
                    <img className="LoginImage" src={LoginImg} alt="LoginImage" />
                </div>
                <div className='login-form'>
                    <form onSubmit={handleSubmit}>
                        <label className='login-username-label'>Username:</label>
                        <input
                            className='login-username-input'
                            type="text"
                            value={loginUser.username}
                            onChange={(e) => handleChange(e, "username")}
                        />
                        {validationErrors.username && <div className='error'>{validationErrors.username}</div>}
                        <br />
                        <label className='login-password-label'>Password:</label>
                        <input
                            className='login-password-input'
                            type="password"
                            value={loginUser.password}
                            onChange={(e) => handleChange(e, "password")}
                        />
                        {validationErrors.password && <div className='error'>{validationErrors.password}</div>}
                        <label className='login-email-label'>Email:</label>
                        <input
                            className='login-email-input'
                            type="email"
                            value={loginUser.email}
                            onChange={(e) => handleChange(e, "email")}
                        />
                        {validationErrors.email && <div className='error'>{validationErrors.email}</div>}
                        {error && <div className='error'>{error}</div>}
                        <div className='loginBtn-container'>
                            <button className='button-19' type="submit">Login</button>
                        </div>
                        <div>
                            <h3>Not a member? <Link to='/register'>Register here</Link></h3>
                        </div>
                        <div className='google-auth'>
                            <button type='button'  onClick={handleGoogleLogin} className='google-btn'>
                                Login with Google
                            </button>
                        </div>
                        {/* <div>
                            <h4><Link to='/doctorlogin'>Login</Link> as Doctor</h4>
                        </div> */}
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
