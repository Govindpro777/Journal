import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/journal"
            element={
              <PrivateRoute>
                <Journal />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/journal" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;