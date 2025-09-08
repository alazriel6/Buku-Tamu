import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { Outlet } from 'react-router-dom';
import './styles/index.css';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
}
