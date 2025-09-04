import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard({ token }) {
  const [stats, setStats] = useState({
    totalWisata: 0,
    totalUsers: 0,
    recentActivities: []
  });
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchStats, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleUserStatus = async (userId, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('Mengupload...');
      await axios.post('http://localhost:5000/api/admin/bulk-upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setUploadStatus('Upload berhasil!');
      fetchStats(); // Refresh stats
    } catch (error) {
      setUploadStatus('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Admin</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Manajemen User
          </button>
          <button 
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Bulk Upload
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Wisata</h3>
              <p className="stat-number">{stats.totalWisata}</p>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="recent-activities">
            <h3>Aktivitas Terbaru</h3>
            <div className="activity-list">
              {stats.recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-time">{new Date(activity.timestamp).toLocaleString()}</span>
                  <span className="activity-description">{activity.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="user-management">
          <table className="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isBanned ? 'banned' : 'active'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    {user.isBanned ? (
                      <button
                        className="btn-unban"
                        onClick={() => handleUserStatus(user._id, 'unban')}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        className="btn-ban"
                        onClick={() => handleUserStatus(user._id, 'ban')}
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="bulk-upload">
          <h3>Upload Data Wisata (CSV/Excel)</h3>
          <form onSubmit={handleFileUpload} className="upload-form">
            <div className="file-input-container">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <button type="submit" className="btn-upload" disabled={!selectedFile}>
                Upload
              </button>
            </div>
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
          </form>
          <div className="upload-instructions">
            <h4>Format File:</h4>
            <p>File CSV/Excel harus memiliki kolom berikut:</p>
            <ul>
              <li>name (Nama wisata)</li>
              <li>kategori (Kategori wisata)</li>
              <li>latitude (Koordinat latitude)</li>
              <li>longitude (Koordinat longitude)</li>
              <li>deskripsi (Deskripsi wisata - opsional)</li>
              <li>jamOperasional (Format JSON - opsional)</li>
              <li>hargaTiket (Format JSON - opsional)</li>
              <li>fasilitas (Dipisahkan dengan koma - opsional)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
