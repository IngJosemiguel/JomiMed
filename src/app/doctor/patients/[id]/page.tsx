"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Calendar, FileText, Plus, Clock, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function DoctorPatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'info' | 'history' | 'appointments'>('info');

    const fetchPatientDetails = React.useCallback(async () => {
        try {
            const res = await fetch(`/api/patients/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPatient(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchPatientDetails();
    }, [id, fetchPatientDetails]);

    if (loading) return <div className="p-8 text-center">Loading patient profile...</div>;
    if (!patient) return <div className="p-8 text-center">Patient not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 text-gray-400 hover:text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-2xl ml-8">
                    {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
                    <p className="text-gray-500 text-sm">Born: {new Date(patient.dateOfBirth).toLocaleDateString()} • {patient.gender}</p>
                </div>
                <div className="ml-auto">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Active Patient
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'info' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Personal Info
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Medical History
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'appointments' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Appointments
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600"><strong className="text-gray-900 font-medium w-24 inline-block">Email:</strong> {patient.email || 'N/A'}</p>
                                <p className="text-sm text-gray-600"><strong className="text-gray-900 font-medium w-24 inline-block">Phone:</strong> {patient.phone || 'N/A'}</p>
                                <p className="text-sm text-gray-600"><strong className="text-gray-900 font-medium w-24 inline-block">Document:</strong> {patient.documentType} {patient.documentNumber}</p>
                                <p className="text-sm text-gray-600"><strong className="text-gray-900 font-medium w-24 inline-block">Address:</strong> {patient.address || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                            <p className="text-sm text-gray-500 italic">No emergency contact configured.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Clinical Records</h3>
                            {/* Doctor can add records directly or via consultation */}
                        </div>

                        {(!patient.medicalRecords || patient.medicalRecords.length === 0) ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">No medical records found.</p>
                                <p className="text-xs text-gray-400 mt-1">Start a consultation to add records.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {patient.medicalRecords.map((record: any) => (
                                    <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex justify-between">
                                            <h4 className="font-semibold text-gray-800">{record.type}</h4>
                                            <span className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{JSON.stringify(record.content)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Appointment History</h3>
                            {/* Doctors usually schedule via Agenda, but having a button here is useful */}
                        </div>
                        {(!patient.appointments || patient.appointments.length === 0) ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">No appointments recorded.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {patient.appointments.map((appt: any) => (
                                    <div key={appt.id} className="flex items-center p-4 border rounded-lg">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-4">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{new Date(appt.datetime).toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">{appt.reason || 'Consultation'}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {appt.status}
                                            </span>
                                            {appt.status === 'SCHEDULED' && (
                                                <Link
                                                    href={`/doctor/consultation/${appt.id}`}
                                                    className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700 transition"
                                                >
                                                    Start Consultation
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
