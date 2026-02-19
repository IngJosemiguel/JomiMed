"use client";

import { Calendar, FileText, Clock, ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function PatientPortalHome() {
    // Mock Data
    const nextAppointment = {
        date: new Date(Date.now() + 86400000 * 2), // 2 days from now
        doctor: "Dr. Sarah Smith",
        specialty: "Cardiology",
        type: "Check-up"
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Patient</h1>
                <p className="text-blue-100 mb-6">Manage your health journey with ease.</p>

                <div className="flex flex-wrap gap-4">
                    <Link href="/portal/appointments/new" className="px-5 py-2.5 bg-white text-blue-700 font-bold rounded-lg shadow hover:bg-blue-50 transition flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" />
                        Book Appointment
                    </Link>
                    <Link href="/portal/records" className="px-5 py-2.5 bg-blue-500/30 text-white font-medium rounded-lg hover:bg-blue-500/40 transition border border-white/20">
                        View History
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upcoming Appointment */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Next Appointment
                        </h2>
                        <Link href="/portal/appointments" className="text-sm text-blue-600 hover:underline">View all</Link>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="bg-white p-3 rounded-lg shadow-sm text-center min-w-[70px]">
                            <span className="block text-xs font-bold text-blue-600 uppercase">{nextAppointment.date.toLocaleString('default', { month: 'short' })}</span>
                            <span className="block text-2xl font-bold text-gray-900">{nextAppointment.date.getDate()}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{nextAppointment.type}</h3>
                            <p className="text-sm text-gray-600">{nextAppointment.doctor} • {nextAppointment.specialty}</p>
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md inline-flex border border-gray-200">
                                <Clock className="w-3 h-3" />
                                {nextAppointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Records */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            Recent Documents
                        </h2>
                        <Link href="/portal/records" className="text-sm text-blue-600 hover:underline">View all</Link>
                    </div>

                    <div className="space-y-3">
                        {['Blood Test Results', 'Annual Check-up Summary', 'Vaccination Record'].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition group cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{doc}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
