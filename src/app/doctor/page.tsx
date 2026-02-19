"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Video, MapPin, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function DoctorAgenda() {
    // Mock Data - In real app fetch from /api/doctor/appointments
    const [date, setDate] = useState(new Date());

    const appointments = [
        { id: 1, time: "09:00", patient: "Maria Garcia", type: "Follow-up", status: "CONFIRMED", reason: "Hypertension check", video: false },
        { id: 2, time: "09:30", patient: "John Doe", type: "New Patient", status: "WAITING", reason: "Chest pain", video: false },
        { id: 3, time: "10:15", patient: "Ana Smith", type: "Consultation", status: "SCHEDULED", reason: "Annual physical", video: true },
        { id: 4, time: "11:00", patient: "Carlos Ruiz", type: "Follow-up", status: "COMPLETED", reason: "Diabetes management", video: false },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header / Date Picker */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
                        <p className="text-sm text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition">Previous</button>
                    <button className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-100 rounded-lg">Today</button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition">Next</button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Appointments</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User className="w-5 h-5" /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Waiting</p>
                        <p className="text-2xl font-bold text-orange-600">2</p>
                    </div>
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock className="w-5 h-5" /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Completed</p>
                        <p className="text-2xl font-bold text-green-600">3</p>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="p-6 hover:bg-gray-50 transition group relative">
                            <div className="flex items-start gap-6">
                                {/* Time */}
                                <div className="flex flex-col items-center min-w-[60px]">
                                    <span className="text-lg font-bold text-gray-900">{appt.time}</span>
                                    <span className="text-xs text-gray-400">AM</span>
                                </div>

                                {/* Status Line */}
                                <div className="absolute left-[85px] top-0 bottom-0 w-px bg-gray-100 group-hover:bg-gray-200"></div>
                                <div className={`absolute left-[81px] top-8 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10 
                                    ${appt.status === 'CONFIRMED' ? 'bg-blue-500' :
                                        appt.status === 'WAITING' ? 'bg-orange-500 animate-pulse' :
                                            appt.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                </div>

                                {/* Details */}
                                <div className="flex-1 ml-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                {appt.patient}
                                                {appt.video && <Video className="w-4 h-4 text-purple-500" />}
                                            </h3>
                                            <p className="text-sm text-gray-500">{appt.reason} • {appt.type}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold 
                                            ${appt.status === 'WAITING' ? 'bg-orange-100 text-orange-700' :
                                                appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-50 text-blue-700'}`}>
                                            {appt.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4">
                                        <Link
                                            href={`/doctor/consultation/${appt.id}`}
                                            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition shadow-sm"
                                        >
                                            Start Consultation
                                        </Link>
                                        <button className="px-4 py-2 text-gray-600 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                                            View Profile
                                        </button>
                                        {appt.video && (
                                            <button className="px-4 py-2 text-purple-700 bg-purple-50 border border-purple-100 text-sm font-medium rounded-lg hover:bg-purple-100 transition flex items-center gap-2">
                                                <Video className="w-4 h-4" /> Join Call
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Menu */}
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
