import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    const [text, setText] = useState("EventGO");

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000); // Show for 3 seconds
        return () => clearTimeout(timer);
    }, [onComplete]);

    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
        exit: {
            y: '-100%',
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial="visible"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            <div className="relative">
                {/* Glowing Background Effect */}
                <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>

                <motion.h1
                    className="relative text-6xl md:text-8xl font-bold tracking-tighter"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {text.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600"
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                    className="h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mt-4 rounded-full mx-auto"
                />
            </div>
        </motion.div>
    );
};

export default SplashScreen;
