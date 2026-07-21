import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import axios from '../axiosConfig'; // or 'axios' if you're not using a custom config


const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/api/auth/is-auth', { withCredentials: true })
      .then(res => {
        const data = res.data;
        if (data.success && data.message === "User is authenticated") {
          setUser(data.user || {});
        } else {
          setUser(null);
        }
      })
      .catch(err => {
        console.error("Auth check failed:", err);
        toast.error("Authentication check failed. Please login again.");
        setUser(null);
      });
  }, []);


  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <Navbar />
      <Header />
      {user ? (
        <p className="text-white mt-4">Welcome, user ID: {user.id}</p>
      ) : (
        <p className="text-white mt-4">Not logged in</p>
      )}
    </div>
  );
};

export default Home;
