"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Stethoscope, Mail } from "lucide-react";
import { X } from "lucide-react";

// Inline Modal Component for simplicity
function CreateDoctorModal({ isOpen, onClose, onSuccess }: any) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create doctor');
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
                    <h2 className="text-xl font-bold text-gray-800">New Doctor</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input name="firstName" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input name="lastName" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <input name="specialization" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cardiology" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CMP / License</label>
                            <input name="medicalLicense" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="CMP-12345" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="doctor@clinic.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                    </div>
                    <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Doctor Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDoctors = async () => {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medical Staff</h1>
                    <p className="text-gray-500">Manage doctors and specialists.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Plus className="w-4 h-4" />
                    Add Doctor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                    <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4 hover:border-blue-300 transition-colors">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{doc.firstName} {doc.lastName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Mail className="w-3 h-3" />
                                {doc.email}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Doctor</span>
                            </div>
                        </div>
                    </div>
                ))}

                {doctors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p>No doctors registered yet.</p>
                    </div>
                )}
            </div>

            <CreateDoctorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDoctors}
            />
        </div>
    );
}
