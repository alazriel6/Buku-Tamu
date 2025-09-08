import { useState, useEffect } from "react";
import { setToken, loginWithGoogle } from "../../auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../../styles/Login.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Tangkap token dari URL jika redirect dari Google OAuth
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            setToken(token);
            toast.success('Login Google berhasil!');
            navigate("/admin");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const data = await res.json();
                toast.error(data.message || 'Login gagal!');
                return;
            }
            const data = await res.json();
            setToken(data.token);
            toast.success('Login berhasil!');
            navigate("/admin");
        } catch (err) {
            toast.error('Terjadi kesalahan saat login!');
        }
    };

    return (
    <div className="center-wrapper">
        <div className="login-container">
            <h2>Login Admin</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="login-button" type="submit">Login</button>
                <button className="login-button" type="button" onClick={loginWithGoogle}>Login with Google</button>

                <button
                    className="login-button"
                    type="button"
                    onClick={() => navigate("/register")}
                    >Belum punya akun? Register
                    </button>
            </form>
        </div>
    </div>
    );
}
