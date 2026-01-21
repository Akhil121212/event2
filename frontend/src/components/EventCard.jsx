import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helper';

const EventCard = ({ event }) => {
    return (
        <motion.div
            whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
            className="glass rounded-xl overflow-hidden relative group perspective-1000"
        >
            <div className="h-48 overflow-hidden">
                <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/50">
                        {event.category}
                    </span>
                    <span className="text-secondary font-bold">₹{event.price}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 truncate">{event.title}</h3>

                <div className="space-y-2 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{event.venue}</span>
                    </div>
                </div>

                <Link to={`/events/${event._id}`} className="block w-full text-center py-2 rounded-lg bg-white/5 hover:bg-primary hover:text-black transition-all border border-white/10">
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

export default EventCard;
