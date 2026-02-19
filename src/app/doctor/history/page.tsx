"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ConsultationHistoryPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            // Fetch appointments with status=COMPLETED
            // In a real app, this might be a dedicated endpoint /api/doctor/history
            const res = await fetch('/api/appointments?status=COMPLETED');
            const data = await res.json();
            setAppointments(data.appointments || []);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        if (filter === 'ALL') return true;
        // Add more filters if needed
        return true;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Consultation History</h1>
                    <p className="text-gray-500">Review past patient visits and records.</p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Records
                    </button>
                    <button
                        onClick={() => setFilter('THIS_MONTH')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'THIS_MONTH' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        This Month
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Patient</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading history...</td>
                                </tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="w-10 h-10 text-gray-300" />
                                            <p className="text-gray-500 font-medium">No past consultations found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-900">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(appt.datetime).toLocaleDateString()}
                                                <span className="text-gray-400 text-xs ml-1">
                                                    {new Date(appt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {appt.patient.firstName[0]}{appt.patient.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{appt.patient.firstName} {appt.patient.lastName}</p>
                                                    <Link href={`/doctor/patients/${appt.patient.id}`} className="text-xs text-blue-500 hover:underline">
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-700">{appt.reason || 'General Consultation'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-teal-600 hover:text-teal-800 font-medium text-xs">View Notes</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
