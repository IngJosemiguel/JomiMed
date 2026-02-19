"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, CheckCircle, Search, ArrowLeft } from "lucide-react";

export default function NewAppointmentPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch available doctors
        const fetchDoctors = async () => {
            try {
                // Assuming we have an endpoint to list doctors
                // If not, we might need to create one or reuse /api/users?role=DOCTOR
                const res = await fetch('/api/doctors');
                const data = await res.json();
                setDoctors(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load doctors", error);
            }
        };
        fetchDoctors();
    }, []);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const datetime = new Date(`${selectedDate}T${selectedTime}`).toISOString();

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: selectedDoctor.id,
                    datetime,
                    reason,
                    type: "CONSULTATION" // Default type
                })
            });

            if (res.ok) {
                setStep(3); // Success step
                setTimeout(() => router.push('/portal/appointments'), 3000);
            } else {
                alert("Failed to book appointment. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error booking appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {step < 3 && (
                <button
                    onClick={() => step === 1 ? router.back() : setStep(step - 1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Progress Bar */}
                <div className="flex border-b border-gray-100">
                    <div className={`flex-1 p-4 text-center border-b-2 ${step >= 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>
                        <span className="font-bold text-sm">1. Select Doctor</span>
                    </div>
                    <div className={`flex-1 p-4 text-center border-b-2 ${step >= 2 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>
                        <span className="font-bold text-sm">2. Date & Time</span>
                    </div>
                    <div className={`flex-1 p-4 text-center border-b-2 ${step >= 3 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>
                        <span className="font-bold text-sm">3. Confirmation</span>
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Choose a Specialist</h2>
                            <div className="grid gap-4">
                                {doctors.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No doctors available for booking at this time.</p>
                                ) : (
                                    doctors.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-200">
                                                {doc.firstName[0]}{doc.lastName[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-blue-700">{doc.firstName} {doc.lastName}</h3>
                                                <p className="text-sm text-gray-500">{doc.specialization || 'General Practice'}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-blue-500" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Schedule Appointment</h2>

                            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {selectedDoctor.firstName[0]}{selectedDoctor.lastName[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-blue-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                                    <p className="text-sm text-blue-700">{selectedDoctor.specialization}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={selectedTime}
                                        onChange={e => setSelectedTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                    placeholder="Briefly describe your symptoms or reason for visit..."
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedDate || !selectedTime || !reason || loading}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? "Booking..." : "Confirm Booking"}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-gray-500 mb-6">Your appointment has been successfully scheduled.</p>
                            <p className="text-sm text-gray-400">Redirecting to appointments...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
