"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Clock, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewAppointmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prePatientId = searchParams.get('patientId');

    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    // Form State
    const [patientId, setPatientId] = useState(prePatientId || '');
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('09:00');
    const [reason, setReason] = useState('Consultation');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const [patRes, docRes] = await Promise.all([
                fetch('/api/patients?limit=100'),
                fetch('/api/settings/users?role=DOCTOR') // Assuming this endpoint exists or similar
            ]);

            const patData = await patRes.json();
            // Mock doctors for now if API missing
            const docData = [{ id: 'doc1', firstName: 'Session', lastName: 'Doctor', specialization: 'General' }];

            setPatients(patData.data || []);
            setDoctors(docData);
        } catch (error) {
            console.error("Error loading resources", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const datetime = new Date(`${date}T${time}:00`).toISOString();

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    doctorId: doctors[0]?.id || 'doc1', // Fallback for demo
                    datetime,
                    reason,
                    status: 'SCHEDULED'
                })
            });

            if (res.ok) {
                router.push(prePatientId ? `/dashboard/patients/${prePatientId}` : '/dashboard/agenda');
            } else {
                alert("Failed to schedule");
            }
        } catch (error) {
            alert("Error scheduling appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                            required
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            disabled={!!prePatientId}
                        >
                            <option value="">Select a patient...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                        >
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                required
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="time"
                                required
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                    <textarea
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Brief description of symptoms or purpose..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Scheduling...' : (
                        <>
                            <Save className="w-5 h-5" />
                            Confirm Appointment
                        </>
                    )}
                </button>

            </form>
        </div>
    );
}
