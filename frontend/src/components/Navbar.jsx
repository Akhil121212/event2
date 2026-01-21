import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold font-['Outfit'] tracking-wider">
                    Event<span className="text-primary">Go</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
                    {token && <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>}
                    {token && role === 'admin' && <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>}

                    {token ? (
                        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400">
                            <LogOut size={18} /> Logout
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-white hover:text-primary">Login</Link>
                            <Link to="/signup" className="px-4 py-2 rounded-lg bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black transition-all">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full glass p-6 flex flex-col gap-4"
                >
                    <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/events" onClick={() => setIsOpen(false)}>Events</Link>
                    {token && <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>}
                    {token && role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>}
                    {token ? (
                        <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
