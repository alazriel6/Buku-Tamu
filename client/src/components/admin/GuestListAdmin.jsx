import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';
import { isAdmin, isAuthenticated, getToken } from '../../auth';
import { toast } from 'react-toastify';

export default function GuestList() {
  const [guests, setGuests] = useState([]);
  const [displayedGuests, setDisplayedGuests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterToday, setFilterToday] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalFiltered, setTotalFiltered] = useState(0);

  const timeFilters = ['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini', 'Semua Data'];

  const isSameDate = (d1, d2) => d1.toDateString() === d2.toDateString();
  const isSameMonth = (d1, d2) => d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear();
  const isSameWeek = (d1, today) => {
  // Ambil awal minggu (Senin)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  // Ambil akhir minggu (Minggu)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return d1 >= weekStart && d1 <= weekEnd;
};

  const [filter, setFilter] = useState('Hari Ini');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let y = 2025; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }
  
  const fetchGuests = async () => {
    const res = await axios.get('http://localhost:5000/api/guests');
    setGuests(res.data);
  };

  const deleteGuest = async (id) => {
    const confirm = window.confirm('Apakah kamu yakin ingin menghapus tamu ini?');
    if (!confirm) return;
    let config = {};
    if (isAuthenticated() && getToken()) {
      config.headers = { Authorization: `Bearer ${getToken()}` };
    }
    try {
      await axios.delete(`http://localhost:5000/api/guests/${id}`, config);
      fetchGuests();
      toast.success('Data tamu berhasil dihapus!');
    } catch (err) {
      toast.error('Gagal menghapus data tamu! Pastikan Anda login sebagai admin Google yang terdaftar.');
    }
  };

  // Filter + sort logic
  useEffect(() => {
    let sorted = [...guests];

    // Sort
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Filter
    const filteredByName = sorted.filter(g => 
      g.name.toLowerCase().includes(search.toLowerCase())
    );

    const today = new Date();
    const filteredByTime = filteredByName.filter(g => {
      const date = new Date(g.createdAt);
      switch (filter) {
        case 'Hari Ini': return isSameDate(date, today);
        case 'Minggu Ini': return isSameWeek(date, today); // tanpa batas bulan
        case 'Bulan Ini': return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        case 'Tahun Ini': return date.getFullYear() === selectedYear;
        case 'Semua Data': return true;
        default: return true;
      }
    });

    setTotalFiltered(filteredByTime.length);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedGuests(filteredByTime.slice(startIndex, endIndex));
  }, [guests, search, filter, sortOrder, currentPage, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchGuests();
  }, []);

  const exportToExcel = async () => {
    let config = {};
    if (isAuthenticated() && getToken()) {
      config.headers = { Authorization: `Bearer ${getToken()}` };
    }
    try {
      const res = await axios.get('http://localhost:5000/api/guests', config);
      const guests = res.data.map(g => ({
      Name: g.name,
      Email: g.email,
      Phone: g.phone,
      Message: g.message,
      Tanggal: new Date(g.createdAt).toLocaleDateString(),
    }));

      const worksheet = XLSX.utils.json_to_sheet(guests);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Tamu');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });

      saveAs(data, 'daftar_tamu.xlsx');
      toast.success('Export Excel berhasil!');
    } catch (err) {
      toast.error('Gagal export Excel! Pastikan Anda login sebagai admin Google yang terdaftar.');
    }
  };

    const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  return (
    <div className="admin-guestlist-container">
      <div className='guest-list'>
        <div className="controls-container">
          <div>
            <h3>Cari nama tamu:</h3>
            <input
              className="search-bar"
              type="text"
              placeholder="Cari Nama"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <h3 className='filter-title'>Sort entries:</h3>
            <select
              className="filter-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>
      </div>

      <div className='guest-list2'>
        <h2>
          Daftar Tamu 
          <span className="count">({totalFiltered})</span>
          {(isAdmin() || isAuthenticated()) && (
          <button
            title="Export Excel"
            className="export-button"
            onClick={exportToExcel}
          >
            <FaFileExcel style={{ marginRight: '8px' }} /> Export to Excel
          </button>
          )}
        </h2>
          <select className="filter-select3" value={filter} onChange={e => { setFilter(e.target.value); setCurrentPage(1);}}>
            {timeFilters.map(option => <option key={option}>{option}</option>)}
          </select>
          {filter === 'Bulan Ini' && (
            <>
            <select className="filter-select4" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select> 
            <select className="filter-select4" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => 2025 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
              </select>
            </>
          )}

        {displayedGuests.length === 0 && <p>Tidak ada tamu yang cocok.</p>}

        {displayedGuests.map((guest) => (
          <div className="card" key={guest._id}>
            <strong>Nama : </strong>{guest.name}
            <p className="meta">Date : {new Date(guest.createdAt).toLocaleString()}</p>
            <p>Message : {guest.message}</p>
            {(isAdmin() || isAuthenticated()) && (
              <>
            <p><strong>Email : </strong>{guest.email || '_'}</p> 
            <p><strong>Phone : </strong>{guest.phone || '_'}</p>
            <button
              className="delete-btn"
              onClick={() => deleteGuest(guest._id)}>
              Hapus
            </button>
              </>
            )}
          </div>
        ))}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}>
              &lt; prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active' : ''}>
                {page}
                </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}>
                next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
