import { useState } from 'react';
import axios from 'axios';
import '../../styles/GuestForm.css';

export default function GuestForm({ onGuestAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return alert('Nama dan pesan harus diisi');
    if (!email || !phone) return alert('Email dan telepon harus diisi');
    try {
      if (!isValidEmail(email)) return alert('Email tidak valid');
      if (!isValidPhone(phone)) return alert('Nomor telepon tidak valid');
    } catch (error) {
      return alert('Email atau nomor telepon tidak valid');
    }

    await axios.post('http://localhost:5000/api/guests', { name, email, phone, message });
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    onGuestAdded();
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className='container-form'>
      <div className='form-title'>Visitor Name</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama" className='form-input' />
      <div className='form-title'>Email Address</div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className='form-input' />
      <div className='form-title'>Phone Number</div>
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telepon" className='form-input' />
      <div className='form-title'>Message</div>
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Pesan" className='form-input' />
      <button type="submit">Kirim</button>
    </div>
    </form>
  );
}
