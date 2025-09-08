import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/GuestList.css';

export default function GuestList() {
  const [guests, setGuests] = useState([]);
  const [displayedGuests, setDisplayedGuests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterToday, setFilterToday] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  const timeFilters = ['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'];

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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalFiltered, setTotalFiltered] = useState(0);
  
  const fetchGuests = async () => {
    const res = await axios.get('http://localhost:5000/api/guests');
    setGuests(res.data);
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
        case 'Bulan Ini': return isSameMonth(date, today);
        case 'Tahun Ini': return isSameYear(date, today);
        case 'Semua Data': return true;
        default: return true;
      }
    });

    setTotalFiltered(filteredByTime.length);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedGuests(filteredByTime.slice(startIndex, endIndex));
  }, [guests, search, filter, sortOrder, currentPage]);

  useEffect(() => {
    fetchGuests();
  }, []);

  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  return (
    <div>
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
          Daftar Tamu <span className="count">({totalFiltered})</span>
        </h2>
          <select className="filter-select3" value={filter} onChange={e => { setFilter(e.target.value); setCurrentPage(1);}}>
            {timeFilters.map(option => <option key={option}>{option}</option>)}
          </select>
        {displayedGuests.length === 0 && <p>Tidak ada tamu yang cocok.</p>}

        {displayedGuests.map((guest) => (
          <div className="card" key={guest._id}>
            <strong>Nama : </strong>{guest.name}
            <p className="meta">{new Date(guest.createdAt).toLocaleString()}</p>
            <p>Message : {guest.message}</p>
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
