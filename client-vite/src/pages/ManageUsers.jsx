// client-vite/src/pages/ManageUsers.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { toast } from 'react-toastify'; // Import toast for notifications

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false); // State for modal visibility
    const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'Student' }); // Default role
    const [creatingUser, setCreatingUser] = useState(false); // State for create user loading

    const navigate = useNavigate();
    const { currentUser, checkAuth } = useAuth();

    const availableRoles = ['admin', 'hod', 'teacher', 'student']; // HOD can only create Teachers or Students
    // If you want HODs to create other HODs, add 'hod', 'HOD' here.


        
    useEffect(() => {
        if (!currentUser || (currentUser.role !== 'hod' && currentUser.role !== 'HOD')) {
            navigate('/unauthorized'); // Or '/login'
            return;
        }
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/user/admin/all', { withCredentials: true });
                setUsers(response.data.users);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err.response?.data?.message || "Failed to fetch users.");
                setLoading(false);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    toast.error("Unauthorized access. Redirecting to login.");
                    navigate('/login');
                } else {
                    toast.error("Failed to load users.");
                }
            }
        };
        fetchUsers();
    }, [currentUser, navigate]);

    const handleRoleChange = async (userId, newRole) => {
        if (currentUser._id === userId) {
            toast.warn("You cannot change your own role from this panel.");
            return;
        }
        if (!window.confirm(`Are you sure you want to change the role of this user to "${newRole}"?`)) {
            return;
        }

        try {
            await axios.put(`/api/user/admin/update-role/${userId}`, { role: newRole }, { withCredentials: true });
            setUsers(prevUsers =>
                prevUsers.map(user => (user._id === userId ? { ...user, role: newRole } : user))
            );
            toast.success('User role updated successfully!');
        } catch (err) {
            console.error("Error updating user role:", err);
            toast.error(err.response?.data?.message || "Failed to update user role.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (currentUser._id === userId) {
            toast.warn("You cannot delete your own account from this panel.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`/api/user/admin/delete/${userId}`, { withCredentials: true });
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            toast.success('User deleted successfully!');
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error(err.response?.data?.message || "Failed to delete user.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        }
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreatingUser(true);
        try {
            await axios.post('/api/user/users', newUserData, { withCredentials: true });
            toast.success('User created successfully!');
            setShowCreateUserModal(false); // Close modal
            setNewUserData({ name: '', email: '', password: '', role: 'Student' }); // Reset form
            fetchUsers(); // Re-fetch users to update the list
        } catch (err) {
            console.error("Error creating user:", err);
            toast.error(err.response?.data?.message || "Failed to create user.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        } finally {
            setCreatingUser(false);
        }
    };


    // if (loading) {
    //     return <DashboardLayout><div className="p-8 text-center">Loading users...</div></DashboardLayout>;
    // }

    if (error) {
        return <DashboardLayout><div className="p-8 text-red-600 text-center">Error: {error}</div></DashboardLayout>;
    }

    if (!currentUser || (currentUser.role !== 'hod' && currentUser.role !== 'HOD')) {
        return <DashboardLayout><div className="p-8 text-red-600 text-center">Access Denied: You must be an HOD to view this page.</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <header className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-800">Manage Users</h1>
                    <p className="text-gray-600 mt-2">View, update roles, and create/delete user accounts.</p>
                </div>
                <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300"
                >
                    Add New User
                </button>
            </header>

            {/* Create User Modal */}
            {showCreateUserModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New User</h2>
                        <form onSubmit={handleCreateUser}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newUserData.name}
                                    onChange={handleNewUserChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={newUserData.email}
                                    onChange={handleNewUserChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={newUserData.password}
                                    onChange={handleNewUserChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={newUserData.role}
                                    onChange={handleNewUserChange}
                                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {availableRoles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
                                    disabled={creatingUser}
                                >
                                    {creatingUser ? 'Creating...' : 'Create User'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateUserModal(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                    disabled={creatingUser}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                {users.length === 0 ? (
                    <p className="text-gray-600">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 border-b border-gray-200">Name</th>
                                    <th className="py-3 px-6 border-b border-gray-200">Email</th>
                                    <th className="py-3 px-6 border-b border-gray-200">Role</th>
                                    <th className="py-3 px-6 border-b border-gray-200">Verified</th>
                                    <th className="py-3 px-6 border-b border-gray-200 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 whitespace-nowrap">{user.name}</td>
                                        <td className="py-3 px-6">{user.email}</td>
                                        <td className="py-3 px-6">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                disabled={currentUser._id === user._id}
                                            >
                                                {availableRoles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-6">
                                            {user.isAccountVerified ? (
                                                <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Yes</span>
                                            ) : (
                                                <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs">No</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={currentUser._id === user._id}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;