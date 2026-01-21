import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { CreditCard, Users, User } from 'lucide-react';

const RegisterEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                toast.error('Could not load event details. Using fallback mode.');
                // Fallback to allow UI testing even if backend fails
                setEvent({
                    title: 'Event Registration',
                    date: new Date(),
                    price: 500, // Default fallback price
                    _id: id
                });
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // Form State
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState([{ name: '', usn: '' }]);
    const [paymentId, setPaymentId] = useState('');

    const addMember = () => {
        if (members.length < 4) {
            setMembers([...members, { name: '', usn: '' }]);
        } else {
            toast.warn('Max 4 members allowed');
        }
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentId) {
            toast.warn('Please enter Transaction ID');
            return;
        }
        try {
            await api.post(`/events/register/${id}`, {
                teamName,
                members,
                paymentReference: paymentId
            });
            toast.success('Registration & Payment Successful!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration Failed');
        }
    };

    if (loading) return (
        <div className="pt-24 text-center min-h-screen flex flex-col items-center justify-center">
            <div className="text-2xl mb-4 text-white">Loading Registration Details...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
    );

    // Safety check if loading is false but event is still null (should be handled by fallback, but just in case)
    if (!event) return (
        <div className="pt-24 text-center min-h-screen flex flex-col items-center justify-center">
            <div className="text-2xl mb-4 text-red-500">Error Loading Event</div>
            <button onClick={() => navigate('/events')} className="btn btn-primary">Back to Events</button>
        </div>
    );

    // QR Code Logic
    const upiLink = event ? `upi://pay?pa=college@upi&pn=EventSystem&am=${event.price || 0}&tn=${event.title}` : '';
    const dynamicQr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    const qrSource = imgError ? dynamicQr : "/payment-qr.png.jpeg";

    return (
        <div className="pt-24 px-6 container mx-auto min-h-screen flex justify-center items-start">
            <motion.div
                className="glass p-8 rounded-2xl w-full max-w-2xl"
            >
                <div className="flex mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setStep(1)}
                        className={`flex-1 text-center pb-2 ${step === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                    >
                        1. Team Details
                    </button>
                    <button
                        onClick={() => step === 1 && teamName ? setStep(2) : null}
                        className={`flex-1 text-center pb-2 ${step === 2 ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                    >
                        2. Payment
                    </button>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Team Information</h2>

                        <div>
                            <label className="block text-gray-400 mb-2">Team Name</label>
                            <input
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-primary"
                                placeholder="e.g. Code Warriors"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-4">Team Members</label>
                            {members.map((member, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 bg-white/5 p-4 rounded-xl md:bg-transparent md:p-0">
                                    <div className="flex-1 relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg outline-none"
                                            placeholder="Student Name"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg outline-none"
                                            placeholder="USN Number"
                                            value={member.usn}
                                            onChange={(e) => handleMemberChange(index, 'usn', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addMember} className="text-sm text-primary hover:text-white flex items-center gap-1">
                                <Users size={14} /> Add Member
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                if (!teamName) {
                                    toast.error('Team Name Required');
                                    return;
                                }
                                // Validate all members have details
                                const invalidMembers = members.some(m => !m.name.trim() || !m.usn.trim());
                                if (invalidMembers) {
                                    toast.error('Please fill in all member details (Name & USN)');
                                    return;
                                }
                                setStep(2);
                            }}
                            className="w-full btn btn-primary mt-6"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 text-center">
                        <h2 className="text-2xl font-bold">Payment Gateway</h2>

                        <div className="bg-white/10 p-4 rounded-xl mb-4">
                            <p className="text-gray-400 text-sm">Amount to Pay</p>
                            <p className="text-3xl font-bold text-primary">₹{event.price || 0}</p>
                        </div>

                        <p className="text-gray-400">Scan QR Code via any UPI App</p>

                        <div className="bg-white p-4 rounded-xl w-56 h-56 mx-auto flex items-center justify-center">
                            <img
                                src={qrSource}
                                onError={() => setImgError(true)}
                                alt="Payment QR"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="text-left mt-6">
                            <label className="block text-gray-400 mb-2">Transaction ID (Required)</label>
                            <input
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-primary"
                                placeholder="Enter Transaction ID (e.g. 12345678)"
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                            />
                        </div>

                        <button onClick={handleSubmit} className="w-full btn btn-primary mt-6">
                            Confirm Registration
                        </button>
                        <button onClick={() => setStep(1)} className="w-full text-gray-400 mt-2 hover:text-white">
                            Back
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default RegisterEvent;
