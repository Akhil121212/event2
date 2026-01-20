import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Plus, Trash2, Edit, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', date: '', description: '', category: 'Technical', venue: '', price: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const eventsRes = await api.get('/events');
            setEvents(eventsRes.data);

            const regRes = await api.get('/admin/registrations');
            setRegistrations(regRes.data);
        } catch (err) {
            console.log(err);
            // toast.error('Failed to load data');
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.date || !formData.description || !formData.venue || !formData.price) {
            toast.warn('Please fill all fields');
            return;
        }

        try {
            await api.post('/admin', formData);
            toast.success('Event Created!');
            setShowForm(false);
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.response?.statusText || 'Failed to create event';
            toast.error(errorMsg);
            if (err.response?.status === 403) {
                toast.error('Only Admins can create events.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/admin/${id}`);
                toast.success('Event Deleted');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete');
            }
        }
    }


    const handleDeleteRegistration = async (id) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            try {
                await api.delete(`/admin/registrations/${id}`);
                toast.success('Registration Deleted');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete registration');
            }
        }
    }

    return (
        <div className="pt-24 px-6 container mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={18} /> Create Event
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-xl mb-8"
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input className="input-field" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input className="input-field" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input className="input-field" placeholder="Venue" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
                        <input className="input-field" type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                        </select>
                        <textarea className="input-field col-span-2" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        <button className="btn btn-primary col-span-2">Create Event</button>
                    </form>
                </motion.div>
            )}

            <div className="glass rounded-xl overflow-hidden mb-12">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Manage Events</h2>
                    <span className="text-sm text-gray-400">Total: {events.length}</span>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white/5 uppercase text-sm text-gray-400">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4">{event.title}</td>
                                <td className="p-4">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="p-4">{event.category}</td>
                                <td className="p-4 flex gap-4">
                                    <button className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(event._id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Registrations Section */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users size={20} className="text-primary" /> Student Registrations
                    </h2>
                    <span className="text-sm text-gray-400">Total: {registrations.length}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 uppercase text-sm text-gray-400">
                            <tr>
                                <th className="p-4">Student</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">Team Name</th>
                                <th className="p-4">Members</th>
                                <th className="p-4">Reg. Date</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No registrations found.</td>
                                </tr>
                            ) : (
                                registrations.map((reg) => (
                                    <tr key={reg._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold">{reg.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-400">{reg.user?.email}</div>
                                        </td>
                                        <td className="p-4">{reg.event?.title || 'Unknown Event'}</td>
                                        <td className="p-4"><span className="text-primary">{reg.teamName}</span></td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {reg.members.map((m, i) => (
                                                    <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
                                                        {m.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(reg.registrationDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDeleteRegistration(reg._id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                title="Delete Registration"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .input-field {
                    width: 100%;
                    padding: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: white;
                    outline: none;
                }
                .input-field:focus {
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
