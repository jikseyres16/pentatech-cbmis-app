import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Constituents from './pages/Constituents';
import Blotter from './pages/Blotter';
import PSA from './pages/PSA';
import BarangayClearance from './pages/BarangayClearance';
import CertificateOfIndigency from './pages/CertificateOfIndigency';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/constituents" element={<ProtectedRoute><Constituents /></ProtectedRoute>} />
        <Route path="/blotter" element={<ProtectedRoute><Blotter /></ProtectedRoute>} />
        <Route path="/psa" element={<ProtectedRoute><PSA /></ProtectedRoute>} />
        <Route path="/barangay-clearance" element={<ProtectedRoute><BarangayClearance /></ProtectedRoute>} />
        <Route path="/certificate-of-indigency" element={<ProtectedRoute><CertificateOfIndigency /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
