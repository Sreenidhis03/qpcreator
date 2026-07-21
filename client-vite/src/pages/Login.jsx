import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
// import { AppContent } from '../context/AppContent'; // <<< REMOVE THIS IMPORT
import { toast } from 'react-toastify';

// --- NEW IMPORT ---
import { useAuth } from '../context/UserContext.jsx'; // <<< IMPORT useAuth hook (note: .jsx extension)
// --- END NEW IMPORT ---

const Login = () => {
    const navigate = useNavigate();

    // --- USE THE NEW AUTH CONTEXT ---
    // We rename 'login' from useAuth to 'authLogin' to avoid conflicts with the component name.
    const { login: authLogin, isLoggedIn, currentUser } = useAuth();
    // We no longer need backendUrl, setIsLoggedin, getUserData from AppContent as
    // authLogin (from useAuth) now handles the backend interaction and state updates directly.
    // --- END NEW AUTH CONTEXT ---

    const [state, setState] = useState('Login'); // Default form state to 'Login'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Optional: Redirect if user is already logged in and tries to access /login
    // This provides immediate UX, though ProtectedRoute in App.jsx also handles this.
    React.useEffect(() => {
        if (!currentUser && !isLoggedIn) {
            // Do nothing, allow login form to show if not logged in.
        } else if (currentUser?.role === 'hod') {
            navigate('/hod-dashboard');
        } else if (currentUser?.role === 'teacher') {
            navigate('/teacher-dashboard');
        } else if (isLoggedIn) { // Logged in but no specific role or unrecognized role
            navigate('/'); // Redirect to a default home page
        }
    }, [isLoggedIn, currentUser, navigate]);


    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Note: axios.defaults.withCredentials = true should be set once, ideally in your main axiosConfig.js
        // or within the AuthContext's axios calls.
        // It's good that it was set in your old setup, but now AuthContext handles it.

        if (state === 'Sign Up') {
            // Your existing registration logic. Consider moving this into AuthContext for consistency
            // if you want to manage registration state/logic centrally.
            try {
                // Assuming `axios` here is your default axios instance with `withCredentials` set
                const { data } = await axios.post('http://localhost:4000/api/auth/register', { name, email, password }); // Directly use full URL if not in axiosConfig

                if (data.success) {
                    toast.success(data.message);
                    // After successful registration, you might want to auto-login the user
                    // or redirect them to an email verification page.
                    navigate('/email-verify'); // Example: redirect to email verification page
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                // Handle Axios network errors or server errors.
                toast.error(error.response?.data?.message || error.message);
            }
        } else { // This block handles the 'Login' submission
            // Use the 'authLogin' function from the AuthContext to handle the login process
            const loginResult = await authLogin(email, password); // This function returns { success, role }

            if (loginResult.success) {
                // Redirect based on the role returned by the authLogin function
                if (loginResult.role === 'hod') {
                    navigate('/hod-dashboard'); // Redirect HODs to their dashboard
                } else if (loginResult.role === 'teacher') {
                    navigate('/teacher-dashboard'); // Redirect teachers to their dashboard
                } else {
                    // Fallback for any other or unrecognized roles
                    navigate('/'); // Redirect to the general home page
                }
            }
            // If loginResult.success is false, the error message is already shown by toast
            // from within the authLogin function in UserContext.jsx.
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6
        sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt=''
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96
            text-indigo-300 text-sm'>

                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account ' : 'Login '}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account ' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler} >
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-700'>
                            <img src={assets.person_icon} alt="" />
                            <input onChange={e => setName(e.target.value)}
                                value={name}
                                className='bg-transparent outline-none' type="text " placeholder='Full Name' required />
                        </div>
                    )}


                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-700'>
                        <img src={assets.mail_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)}
                            value={email} className='bg-transparent outline-none' type="email" placeholder='Email Id' required />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-700'>
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)}
                            value={password} className='bg-transparent outline-none' type="password " placeholder='Password' required />
                    </div>

                    <p onClick={() => navigate('/reset-pswrd')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white
                    font-medium'>{state}</button>
                </form>
                {state == 'Sign Up' ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
                    </p>
                )
                    : (
                        <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
                            <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign up</span>
                        </p>
                    )}


            </div>
        </div>
    )
}

export default Login;