import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            if (res.data.emailSent) {
                toast.success('Registration Successful! Welcome Email Sent 📧');
            } else {
                toast.success('Registration Successful!');
            }

            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-20 bg-grid opacity-20"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-secondary/20 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float-delayed"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass p-8 rounded-2xl w-full max-w-md relative z-10"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    {/* Role Selection (Optional for demo) */}
                    <div>
                        <label className="block text-gray-400 mb-2">Role</label>
                        <select
                            className="w-full p-3 bg-black text-white border border-white/10 rounded-lg focus:border-primary outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full btn btn-primary">Sign Up</button>
                    <p className="text-center text-gray-400">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
