"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    User,
    Calendar,
    Clock,
    FileText,
    Save,
    CheckCircle,
    AlertCircle,
    Pill,
    Activity
} from 'lucide-react';

export default function ConsultationPage() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.appointmentId as string;

    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('SOAP');
    const [soap, setSoap] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    useEffect(() => {
        if (appointmentId) fetchContext();
    }, [appointmentId]);

    const fetchContext = async () => {
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`);
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();
            setPatient(data.patient);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/doctor/consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId,
                    soap
                })
            });

            if (res.ok) {
                alert("Consultation finalized successfully!");
                router.push('/doctor');
            } else {
                alert("Error saving consultation");
            }
        } catch (error) {
            console.error(error);
            alert("Network error");
        }
    };

    if (loading) return <div className="p-12 text-center">Loading patient context...</div>;
    if (!patient) return <div className="p-12 text-center text-red-500">Patient context not found</div>;

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Left Panel: Patient Context */}
            <div className="w-1/3 flex flex-col gap-6">
                {/* Patient Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                            {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h2>
                            <p className="text-gray-500">{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} Years • {patient.gender}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>09:00 AM - 09:30 AM (Current)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-red-600">Allergies: Penicillin</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <span>History: Hypertension, Asthma</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-3">Last Vitals (2 weeks ago)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block">Blood Pressure</span>
                                <span className="font-bold text-gray-900">120/80</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block">Heart Rate</span>
                                <span className="font-bold text-gray-900">72 bpm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Quick View */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-auto">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Recent History
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-800">General Checkup</span>
                                    <span className="text-xs text-gray-500">Oct 12, 2025</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    Patient reported mild headaches. Prescribed Paracetamol.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Consultation Workspace */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('SOAP')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'SOAP' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Clinical Note (SOAP)
                    </button>
                    <button
                        onClick={() => setActiveTab('RX')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'RX' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Prescriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('LABS')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'LABS' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Lab Orders
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    {activeTab === 'SOAP' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Subjective</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                        placeholder="Patient's complaints, symptoms, and history..."
                                        value={soap.subjective}
                                        onChange={e => setSoap({ ...soap, subjective: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Objective</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                        placeholder="Physical exam findings, vital signs, lab results..."
                                        value={soap.objective}
                                        onChange={e => setSoap({ ...soap, objective: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Assessment</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                        placeholder="Diagnosis and differential diagnosis..."
                                        value={soap.assessment}
                                        onChange={e => setSoap({ ...soap, assessment: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Plan</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                        placeholder="Treatment, medications, referrals, follow-up..."
                                        value={soap.plan}
                                        onChange={e => setSoap({ ...soap, plan: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'RX' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Pill className="w-5 h-5 text-teal-600" />
                                Prescription Management
                            </h3>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Medication Name (e.g. Amoxicillin 500mg)"
                                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                        id="medName"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Instructions (e.g. Take 1 tablet every 8 hours)"
                                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                        id="medInstr"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const name = (document.getElementById('medName') as HTMLInputElement).value;
                                        const instr = (document.getElementById('medInstr') as HTMLInputElement).value;
                                        if (name) {
                                            setSoap(prev => ({
                                                ...prev,
                                                plan: prev.plan + `\n[RX] ${name} - ${instr}`
                                            }));
                                            (document.getElementById('medName') as HTMLInputElement).value = '';
                                            (document.getElementById('medInstr') as HTMLInputElement).value = '';
                                        }
                                    }}
                                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm font-medium"
                                >
                                    + Add to Plan
                                </button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Current Medications in Plan:</h4>
                                <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-wrap font-sans">
                                    {soap.plan || "No medications added yet."}
                                </pre>
                            </div>

                            <button
                                onClick={async () => {
                                    // Dynamic import to avoid SSR issues if any
                                    const { generatePrescriptionPDF } = await import('@/core/application/services/PdfService');
                                    generatePrescriptionPDF({
                                        clinicName: "JomiMed Clinic",
                                        doctorName: "Session Doctor", // Should come from context
                                        patientName: `${patient.firstName} ${patient.lastName}`,
                                        date: new Date().toLocaleDateString(),
                                        items: soap.plan.split('\n').filter(l => l.includes('[RX]')),
                                        instructions: "Please follow dosage instructions carefully."
                                    });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit"
                            >
                                <FileText className="w-4 h-4" />
                                Generate & Print Prescription PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Finalize Consultation
                    </button>
                </div>
            </div>
        </div>
    );
}
