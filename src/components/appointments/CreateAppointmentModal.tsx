"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialDate?: Date;
}

export default function CreateAppointmentModal({ isOpen, onClose, onSuccess, initialDate }: CreateAppointmentModalProps) {
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        datetime: '',
        duration: 30,
        reason: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchPatients();
            fetchDoctors();
            if (initialDate) {
                // Format to YYYY-MM-DDTHH:mm for datetime-local input
                const isoString = new Date(initialDate.getTime() - (initialDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                setFormData(prev => ({ ...prev, datetime: isoString }));
            }
        }
    }, [isOpen, initialDate]);

    const fetchPatients = async () => {
        try {
            const res = await fetch('/api/patients?limit=100');
            const data = await res.json();
            setPatients(Array.isArray(data.patients) ? data.patients : []);
        } catch (e) {
            console.error(e);
            setPatients([]);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await fetch('/api/doctors');
            if (res.status === 404) { setDoctors([]); return; }
            const data = await res.json();
            // Handle both array or { doctors: [...] } format
            const list = Array.isArray(data) ? data : (data.doctors || []);
            setDoctors(Array.isArray(list) ? list : []);
        } catch (e) {
            console.error(e);
            setDoctors([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    datetime: new Date(formData.datetime).toISOString(),
                    duration: Number(formData.duration)
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to schedule');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">New Appointment</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Patient</label>
                        <select
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={formData.patientId}
                            onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Doctor</label>
                        <select
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={formData.doctorId}
                            onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                value={formData.datetime}
                                onChange={e => setFormData({ ...formData, datetime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                            <input
                                type="number"
                                required
                                min="5"
                                step="5"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Check-up, Follow-up..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Scheduling...' : 'Schedule Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
