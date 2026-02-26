import React, { useState, useEffect } from 'react';
import axios from '../axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({ constituents: 0, blotters: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Constituents</div>
          <div className="stat-value">{stats.constituents}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Blotters</div>
          <div className="stat-value">{stats.blotters}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;