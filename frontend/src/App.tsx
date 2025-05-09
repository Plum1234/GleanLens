import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import LogsPage from './pages/LogsPage';
export default function App() {
  return (
    <BrowserRouter>
      <header>
        <a href="/" className="logo">GleanLens</a>
        <nav>
          <Link to="/">Search</Link>
          <Link to="/logs">Logs</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
