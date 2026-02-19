"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Filter, Search, Activity, Pill, FlaskConical } from "lucide-react";

export default function PatientRecordsPage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await fetch('/api/portal/records');
            const data = await res.json();
            setRecords(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'PRESCRIPTION': return <Pill className="w-5 h-5 text-blue-600" />;
            case 'LAB_RESULT': return <FlaskConical className="w-5 h-5 text-purple-600" />;
            default: return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    const filteredRecords = filter === 'ALL'
        ? records
        : records.filter(r => r.type === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
                    <p className="text-gray-500">Access your clinical documents and test results</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="ALL">All Records</option>
                            <option value="CONSULTATION">Consultations</option>
                            <option value="PRESCRIPTION">Prescriptions</option>
                            <option value="LAB_RESULT">Lab Results</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <Filter className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading records...</div>
            ) : filteredRecords.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                    <p className="text-gray-500 mb-6">You don't have any medical records in this category.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                {getIcon(record.type)}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                                    <h3 className="font-bold text-gray-900">{record.type.replace('_', ' ')}</h3>
                                    <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                                </p>
                                <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-2">
                                    {/* Preview of content */}
                                    {typeof record.content === 'string' ? record.content : JSON.stringify(record.content)}
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition self-start md:self-center">
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
