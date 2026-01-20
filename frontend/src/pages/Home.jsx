import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen pt-20 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-6 text-gradient"
                >
                    The Future of <br /> College Events
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
                >
                    Discover, register, and manage technical, cultural, and sports events with a seamless next-gen experience.
                </motion.p>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-6"
                >
                    <Link to="/events" className="btn btn-primary">Explore Events</Link>
                    <Link to="/signup" className="btn btn-outline">Join Now</Link>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Calendar className="w-8 h-8 text-primary" />, count: "50+", label: "Active Events" },
                        { icon: <Users className="w-8 h-8 text-secondary" />, count: "2k+", label: "Students Registered" },
                        { icon: <Trophy className="w-8 h-8 text-yellow-400" />, count: "₹1L+", label: "Prize Pool" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="glass p-8 rounded-xl flex flex-col items-center justify-center text-center"
                        >
                            <div className="mb-4 bg-white/5 p-4 rounded-full">{stat.icon}</div>
                            <h3 className="text-3xl font-bold mb-2">{stat.count}</h3>
                            <p className="text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
