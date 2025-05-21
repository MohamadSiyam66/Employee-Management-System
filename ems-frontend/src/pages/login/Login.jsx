import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginDetails = {
                email: email,
                password: password
            }

        try{
            const res = await axios.post('http://localhost:8080/api/auth/login', loginDetails, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.data.id){
                localStorage.setItem('userId', res.data.id);
                localStorage.setItem('userEmail', res.data.email);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('userName', res.data.name);
                // console.log(res.data.role);

                if (res.data.role === 'ADMIN') navigate('/admin');
                else if (res.data.role === 'EMPLOYEE') navigate('/employee');
                else alert('Unknown role');
            }else{
                alert('Invalid Credentials');
            }
        } catch (err) {
            alert('Invalid email or password '+ err.message);
        }

    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' name='email' placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' name='password' placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <center>
                    <button type="submit">Login</button>
                </center>
                
            </form>
        </div>
    );
}

export default Login;
