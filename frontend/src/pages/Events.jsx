import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import api from '../utils/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // In real app use api.get('/events'). For demo I'll mock if API fails or empty
                const res = await api.get('/events');
                setEvents(res.data);
                setFilteredEvents(res.data);
            } catch (err) {
                console.error(err);
                setEvents([]);
                setFilteredEvents([]);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;
        if (category !== 'All') {
            result = result.filter(e => e.category === category);
        }
        if (search) {
            result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredEvents(result);
    }, [search, category, events]);

    return (
        <div className="pt-24 min-h-screen px-6 container mx-auto">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold mb-8 text-gradient"
            >
                Connect with Events
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-6 mb-12">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none transition-all"
                    />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                    {['All', 'Technical', 'Cultural', 'Sports'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${category === cat
                                ? 'bg-primary text-black border-primary'
                                : 'border-white/10 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <h2 className="text-2xl font-bold mb-2">No Events Found</h2>
                        <p>Check back later or try a different filter.</p>
                    </div>
                ) : filteredEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default Events;
