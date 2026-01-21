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
        title: '', date: '', description: '', category: 'Technical', venue: '', price: 0, image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);

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



    const resetForm = () => {
        setFormData({ title: '', date: '', description: '', category: 'Technical', venue: '', price: 0, image: '' });
        setImageFile(null);
        setEditId(null);
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            date: event.date.split('T')[0], // Format date for input
            description: event.description,
            category: event.category,
            venue: event.venue,
            price: event.price,
            image: event.image
        });
        setEditId(event._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.date || !formData.description || !formData.venue || !formData.price) {
            toast.warn('Please fill all fields');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('date', formData.date);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('venue', formData.venue);
        data.append('price', formData.price);
        // If file is selected, append it. Otherwise send image URL string if needed (though backend prioritizes file)
        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editId) {
                await api.put(`/admin/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Event Updated!');
            } else {
                await api.post('/admin', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Event Created!');
            }
            setShowForm(false);
            resetForm();
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.response?.statusText || 'Failed to save event';
            toast.error(errorMsg);
            if (err.response?.status === 403) {
                toast.error('Only Admins can manage events.');
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
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

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Event Image (File or URL)</label>
                            <div className="flex flex-col md:flex-row gap-2">
                                <input
                                    type="file"
                                    className="input-field flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80"
                                    onChange={e => setImageFile(e.target.files[0])}
                                    accept="image/*"
                                />
                                <input
                                    className="input-field flex-1"
                                    placeholder="Or paste Image URL"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                        </div>
                        <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                        </select>
                        <textarea className="input-field col-span-1 md:col-span-2" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        <button className="btn btn-primary col-span-1 md:col-span-2">{editId ? 'Update Event' : 'Create Event'}</button>
                    </form>
                </motion.div>
            )}

            <div className="glass rounded-xl overflow-hidden mb-12">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Manage Events</h2>
                    <span className="text-sm text-gray-400">Total: {events.length}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
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
                                        <button onClick={() => handleEdit(event)} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(event._id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
        </div >
    );
};

export default AdminPanel;
