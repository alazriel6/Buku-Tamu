import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { isAuthenticated, getToken } from '../../auth';
import axios from "axios";
import '../../styles/SummaryGuest.css';

const timeFilters = ['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'];

export default function SummaryGuest() {
  const [guests, setGuests] = useState([]);
  const [filter, setFilter] = useState('Hari Ini');
  const [targetPerDay, setTargetPerDay] = useState(50);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const config = {};
        if (isAuthenticated() && getToken()) {
          config.headers = { Authorization: `Bearer ${getToken()}` };
        }
        const res = await axios.get('http://localhost:5000/api/guests', config);
        setGuests(res.data);
      } catch (err) {
        console.error("Failed to fetch guests:", err);
      }
    };
    fetchGuests();
  }, []);

  const today = new Date();
  const isSameDate = (d1, d2) => d1.toDateString() === d2.toDateString();
  const isSameWeek = (d1, d2) => {
    const weekStart = d => new Date(d.setDate(d.getDate() - d.getDay() + 1));
    return weekStart(new Date(d1)).toDateString() === weekStart(new Date(d2)).toDateString();
  };
  const isSameMonth = (d1, d2) => d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear();

  const filteredGuests = guests.filter(guest => {
    const date = new Date(guest.createdAt);
    switch (filter) {
      case 'Hari Ini': return isSameDate(date, today);
      case 'Minggu Ini': return isSameWeek(date, today);
      case 'Bulan Ini': return isSameMonth(date, today);
      case 'Tahun Ini': return isSameYear(date, today);
      default: return true;
    }
  });

  const hadirCount = filteredGuests.length;
  const totalGuests = guests.length;
  const averagePerDay = Math.round(hadirCount / (filteredGuests.length || 1));
  const reached = Math.min(hadirCount, targetPerDay);
  const remaining = Math.max(targetPerDay - reached, 0);

  const pieData = [
    { name: 'Tercapai', value: reached },
    { name: 'Sisa Target', value: remaining }
  ];

  const pieColors = ['#00C49F', '#ddd'];

  const barData = filteredGuests.reduce((acc, guest) => {
    const date = new Date(guest.createdAt).toISOString().split('T')[0];
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ date, total: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="dashboard-container">
    <div className="dashboard-summary-container">
      <div className="target-input-container">
        <label>Target/hari</label>
        <input
          type="text"
          placeholder="Masukkan target per hari"
          value={targetPerDay}
          onChange={e => setTargetPerDay(Number(e.target.value))}
          className="target-input"
        />
      </div>
      <div className="dashboard-header">
        <select className="filter-select2" value={filter} onChange={e => setFilter(e.target.value)}>
          {timeFilters.map(option => <option key={option}>{option}</option>)}
        </select>
      </div>
      </div>

      <div className="summary-header">
        <h1>Ringkasan Tamu</h1>
      </div>

    <div className="dashboard-summary-container2">
      <div className="card-grid">
        <div className="card">
          <p className="card-title">Total Tamu</p>
          <p className="card-value">{totalGuests}</p>
        </div>
        <div className="card">
          <p className="card-title">Hadir ({filter})</p>
          <p className="card-value">{hadirCount}</p>
        </div>
        <div className="card">
          <p className="card-title">Rata-rata/Hari</p>
          <p className="card-value">{averagePerDay}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-box">
          <h3>Total Kehadiran ({filter})</h3>
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <p>{hadirCount}</p>
              <span>Dari {targetPerDay} tamu</span>
            </div>
          </div>
        </div>

        <div className="chart-box">
          <h3>Kehadiran per Hari</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Jumlah Tamu" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box full">
          <h3>Tren Kehadiran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#00C49F" name="Total Hadir" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </div>
  );
}
