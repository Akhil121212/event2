import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Calendar, MapPin, Users, User, Mail, Shield } from 'lucide-react';

const Dashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Fetch User Details
                const userRes = await api.get('/auth/me');
                setUser(userRes.data);

                // Fetch Registrations
                const regRes = await api.get('/events/my-registrations');
                setRegistrations(regRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboard();
    }, []);

    if (!user) return <div className="pt-24 text-center">Loading Dashboard...</div>;

    return (
        <div className="pt-24 px-6 container mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gradient">My Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass p-6 rounded-xl h-fit sticky top-24">
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-full mb-6 mx-auto flex items-center justify-center text-3xl font-bold text-black uppercase">
                        {user.name[0]}
                    </div>

                    <div className="text-center space-y-4 mb-8">
                        <div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-1">
                                <Mail size={14} /> {user.email}
                            </div>
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm capitalize flex items-center gap-2 mx-auto w-fit">
                            <Shield size={12} className="text-primary" /> {user.role}
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                            <span className="text-gray-400">Total Events</span>
                            <span className="text-2xl font-bold text-primary">{registrations.length}</span>
                        </div>
                    </div>
                </div>

                {/* Admin Quick Link */}
                {user.role === 'admin' && (
                    <div className="lg:col-span-2">
                        <div className="glass p-6 rounded-xl flex justify-between items-center bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Admin Dashboard Available</h2>
                                <p className="text-gray-400 text-sm">Manage events and view all student registrations.</p>
                            </div>
                            <a href="/admin" className="btn btn-primary">Go to Admin Panel</a>
                        </div>
                    </div>
                )}

                {/* Registered Events List */}
                {user.role !== 'admin' && (
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Calendar className="text-primary" /> My Registrations
                        </h2>

                        {registrations.length === 0 && (
                            <div className="glass p-12 rounded-xl text-center text-gray-500">
                                <p className="text-xl mb-4">No events registered yet.</p>
                                <a href="/events" className="btn btn-primary inline-block">Browse Events</a>
                            </div>
                        )}

                        {registrations.map((reg) => (
                            <motion.div
                                key={reg._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01 }}
                                className="glass p-6 rounded-xl flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-2 bg-gradient-to-r from-primary to-secondary text-black text-xs font-bold rounded-bl-lg shadow-lg">
                                    Confirmed
                                </div>

                                <div className="bg-white p-3 rounded-xl shrink-0 h-fit self-center">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${reg._id}`}
                                        alt="Registration QR"
                                        className="w-24 h-24"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{reg.event?.title}</h3>
                                    <div className="flex items-center gap-2 text-secondary font-bold mb-4 bg-secondary/10 w-fit px-3 py-1 rounded-lg">
                                        <Users size={14} /> Team: {reg.teamName}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-300 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            <span>{new Date(reg.event?.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-primary" />
                                            <span>{reg.event?.venue}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-3">
                                        <p className="text-sm text-gray-400 mb-2">Team Members:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {reg.members.map((m, i) => (
                                                <span key={i} className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 flex items-center gap-1">
                                                    <User size={10} /> {m.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
