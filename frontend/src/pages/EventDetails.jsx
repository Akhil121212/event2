import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            // Try real fetch
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                toast.error('Failed to load event');
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event) return;
        const interval = setInterval(() => {
            if (!event.date) return;
            const now = new Date();
            const eventDate = new Date(event.date);
            const diff = eventDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('Event Started');
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [event]);

    const navigate = useNavigate();

    const handleRegister = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to register');
            navigate('/login');
            return;
        }
        navigate(`/events/${id}/register`);
    };

    if (!event) return (
        <div className="pt-24 text-center min-h-screen flex flex-col items-center justify-center">
            <div className="text-2xl mb-4">Loading Event Details...</div>
            <p className="text-gray-400 mb-6">If this takes too long, the event might not exist.</p>
            <button onClick={() => navigate('/events')} className="btn btn-outline">Back to Events</button>
        </div>
    );

    return (
        <div className="pt-20 min-h-screen">
            {/* Hero Image */}
            <div className="h-[50vh] relative">
                <img src={event.image || 'https://images.unsplash.com/photo-1504384308090-c54be3855833'} className="w-full h-full object-cover" alt={event.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-16 container mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                        {event.title}
                    </h1>
                    <div className="flex gap-6 text-xl text-gray-300">
                        <div className="flex items-center gap-2">
                            <Calendar /> {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin /> {event.venue}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-6">About Event</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">{event.description}</p>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6 rounded-xl text-center">
                        <h3 className="text-xl font-bold mb-4">Event Starts In</h3>
                        <div className="text-4xl font-mono text-primary font-bold">
                            {timeLeft}
                        </div>
                    </div>

                    <div className="glass p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400">Entry Fee</span>
                            <span className="text-3xl font-bold">₹{event.price}</span>
                        </div>
                        <button onClick={handleRegister} className="w-full btn btn-primary text-lg py-4">
                            Register Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
