"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, FileText, Plus } from "lucide-react";

export default function PatientAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('/api/portal/appointments');
            const data = await res.json();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const upcoming = appointments.filter(a => new Date(a.datetime) > new Date());
    const past = appointments.filter(a => new Date(a.datetime) <= new Date());

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-500">Manage your visits and consultations</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Plus className="w-4 h-4" />
                    Book New Appointment
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading appointments...</div>
            ) : (appointments.length === 0) ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No appointments yet</h3>
                    <p className="text-gray-500 mb-6">You haven&apos;t booked any appointments.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Upcoming */}
                    {upcoming.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Upcoming
                            </h2>
                            <div className="grid gap-4">
                                {upcoming.map(appt => (
                                    <AppointmentCard key={appt.id} appt={appt} isUpcoming />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Past */}
                    {past.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                Past History
                            </h2>
                            <div className="grid gap-4 opacity-75">
                                {past.map(appt => (
                                    <AppointmentCard key={appt.id} appt={appt} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function AppointmentCard({ appt, isUpcoming }: { appt: any, isUpcoming?: boolean }) {
    return (
        <div className={`bg-white p-6 rounded-xl border transition flex flex-col md:flex-row gap-6 ${isUpcoming ? 'border-blue-100 shadow-sm hover:shadow-md' : 'border-gray-100'}`}>
            {/* Date Badge */}
            <div className={`flex flex-col items-center justify-center p-4 rounded-lg min-w-[100px] ${isUpcoming ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                <span className="text-xs font-bold uppercase tracking-wider">{new Date(appt.datetime).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-3xl font-bold">{new Date(appt.datetime).getDate()}</span>
                <span className="text-xs font-medium">{new Date(appt.datetime).toLocaleString('default', { weekday: 'short' })}</span>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{appt.reason || 'General Consultation'}</h3>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {new Date(appt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            <span className="text-gray-300">|</span>
                            {appt.duration} min
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        appt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {appt.status}
                    </span>
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}</p>
                            <p className="text-xs text-gray-500">{appt.doctor?.specialization || 'General Practitioner'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                {isUpcoming ? (
                    <>
                        <button className="w-full py-2 px-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                            Reschedule
                        </button>
                        <button className="w-full py-2 px-3 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                            Cancel
                        </button>
                    </>
                ) : (
                    <button className="w-full py-2 px-3 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" /> Summary
                    </button>
                )}
            </div>
        </div>
    );
}
