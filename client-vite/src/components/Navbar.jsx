import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContent';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
 

  const sendVerification = async (userData) => {
  try {
    axios.defaults.withCredentials = true;
console.log(userData, "===============")
    const { data } = await axios.post('/api/auth/send-verify-otp', {userData}, { withCredentials: true });

    if (data.success) {
      toast.success(data.message);
      navigate('/email-verify');
    } else {
      toast.error(data.message || 'Verification failed');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};



  const Logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {}, // empty body
        {
          withCredentials: true, // send cookies with request
        }
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
        toast.success('Logged out successfully');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        alt="QPCreator Logo"
        className="w-28 sm:w-32 object-contain"
      />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
          {userData?.name?.[0]?.toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData?.isAccountVerified && (
                <li onClick={()=>sendVerification(userData)} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}
              <li
                onClick={Logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                LogOut
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-700 hover:bg-gray-500 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
