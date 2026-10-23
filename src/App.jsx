import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReadingModeProvider } from './context/ReadingModeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import WritePage from './pages/WritePage';
import PostDetailPage from './pages/PostDetailPage';
import DraftsPage from './pages/DraftsPage';
import ProfilePage from './pages/ProfilePage';
import GuidelinesPage from './pages/GuidelinesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReadingModeProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/write" element={<WritePage />} />
                <Route path="/edit/:id" element={<WritePage />} />
                <Route path="/drafts" element={<DraftsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/author/:userId" element={<ProfilePage />} />
                <Route path="/guidelines" element={<GuidelinesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
          </div>
        </ReadingModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
