import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './component/Auth/Auth';
import Profile from './component/Profile/Profile';
import Header from './component/Header/Header';
import Home from './component/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<WithHeader />} />
      </Routes>
    </Router>
  );
}

const WithHeader = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:username" element={<Profile />} />
    </Routes>
  </>
);

export default App;
