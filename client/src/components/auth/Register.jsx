import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Register gagal!");
        return;
      }

      toast.success("Register berhasil, silakan login!");
      navigate("/login");
    } catch (err) {
      toast.error("Terjadi kesalahan saat register!");
    }
  };

  return (
    <div className="center-wrapper">
      <div className="login-container">
        <h2>Register Admin</h2>
        <form onSubmit={handleRegister}>
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
          <button className="login-button" type="submit">
            Register
          </button>
          <button
            className="login-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            Sudah punya akun? Login
          </button>
        </form>
      </div>
    </div>
  );
}
