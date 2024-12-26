import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FallingFlowers from "./components/FallingFlowers";
import LoiChuc from './pages/LoiChuc';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import AIWishGenerator from './pages/AIWishGenerator';
import Thiep from './pages/Thiep';
import Footer from './components/common/Footer';
import TetQA from './pages/TetQA';
import HaiLoc from './pages/HaiLoc';
import { useLocation } from 'react-router-dom';
import LuckyDrawManagement from './pages/admin/LuckyDrawManagement';
import MonAn from './pages/MonAn';
import ChiTietMonAn from './pages/ChiTietMonAn';
import MusicPlayer from './components/MusicPlayer';
import ChatWidget from './components/ChatWidget';
import ChatManagement from './components/admin/ChatManagement';

// Tạo component wrapper để kiểm tra route và render FallingFlowers
const FlowersWrapper = () => {
  const location = useLocation();
  const showFlowers = ['/', '/hai-loc'].includes(location.pathname);

  return showFlowers ? <FallingFlowers /> : null;
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-yellow-50">
            <FlowersWrapper />
            <Navbar />
            <main className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/loi-chuc" element={<LoiChuc />} />
                <Route path="/thiep" element={<Thiep />} />
                <Route path="/hai-loc" element={<HaiLoc />} />
                <Route path="/mon-an" element={<MonAn />} />
                <Route path="/mon-an/:id" element={<ChiTietMonAn />} />
                
                {/* Redirect /login to /admin/login */}
                <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/lucky-draws" 
                  element={
                    <PrivateRoute>
                      <LuckyDrawManagement />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/chats" 
                  element={
                    <PrivateRoute>
                      <ChatManagement />
                    </PrivateRoute>
                  } 
                />
                
                {/* Thêm route ẩn cho AI generator */}
                <Route path="/tao-loi-chuc-ai" element={<AIWishGenerator />} />
                <Route path="/hoi-dap" element={<TetQA />} />
              </Routes>
            </main>
            <Footer />
            <ChatWidget />
            <MusicPlayer />
          </div>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
