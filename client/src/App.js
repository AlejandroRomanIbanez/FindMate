import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './component/Auth/Auth';
import Profile from './component/Profile/Profile';
import Header from './component/Header/Header';
import Home from './component/Home/Home';

function App() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState({});

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error('Error fetching user data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/user/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setAllUsers(data);
      } else {
        console.error('Error fetching all users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchAllUsers();
  }, [fetchUserData, fetchAllUsers]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={
          <WithHeader 
            user={user} 
            setUser={setUser} 
            allUsers={allUsers} 
            setAllUsers={setAllUsers} 
            fetchUserData={fetchUserData} 
            loading={loading} 
            setLoading={setLoading} 
          />
        } />
      </Routes>
    </Router>
  );
}

const WithHeader = React.memo(({ user, setUser, allUsers, setAllUsers, fetchUserData, loading, setLoading }) => (
  <>
    <Header user={user} setUser={setUser} allUsers={allUsers} loading={loading} setLoading={setLoading} fetchUserData={fetchUserData} />
    <Routes>
      <Route path="/" element={
        <Home 
          user={user} 
          setUser={setUser} 
          allUsers={allUsers} 
          setAllUsers={setAllUsers} 
          fetchUserData={fetchUserData} 
          loading={loading} 
          setLoading={setLoading} 
        />
      } />
      <Route path="/profile/:username" element={<Profile />} />
    </Routes>
  </>
));

export default App;