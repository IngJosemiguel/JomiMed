"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, User } from 'lucide-react';
import CreatePatientModal from '@/components/patients/CreatePatientModal';

export default function DoctorPatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPatients = React.useCallback(async () => {
        setLoading(true);
        try {
            const query = search ? `?search=${search}` : '';
            const res = await fetch(`/api/patients${query}`);
            const data = await res.json();
            setPatients(data.patients || []);
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchPatients();
    }, [search, fetchPatients]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
                    <p className="text-gray-500">View and manage your patient list</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Patient
                </button>
            </div>

            <CreatePatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPatients}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, DNI, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Document</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading patients...</td>
                                </tr>
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <User className="w-10 h-10 text-gray-300" />
                                            <p className="text-gray-500 font-medium">No patients found</p>
                                            <p className="text-gray-400 text-xs">Try adjusting your search or add a new patient.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50 transition cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                                    {patient.firstName[0]}{patient.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                                                    <p className="text-xs text-gray-500">{new Date(patient.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                            <span className="bg-gray-100 px-2 py-1 rounded">{patient.documentType}</span> {patient.documentNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{patient.email || '-'}</p>
                                            <p className="text-xs text-gray-500">{patient.phone || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`/doctor/patients/${patient.id}`} className="text-teal-600 hover:text-teal-800 font-medium text-xs">View Profile</a>
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
