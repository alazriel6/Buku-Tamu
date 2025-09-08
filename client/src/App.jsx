import GuestForm from './components/user/GuestForm';
import GuestList from './components/user/GuestListPublic';
import { useState } from 'react';
import './styles/index.css';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleNewGuest = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="container">
      <div className="guest-form-panel">
        <h1 className="title-tamu">Buku Tamu</h1>
        <GuestForm onGuestAdded={handleNewGuest} />
      </div>
      <div className="guest-list-panel">
        <GuestList key={refresh} />
      </div>
    </div>
  );
}

export default App;
