"use client";

import { useState, useEffect } from "react";
import { Search, Filter, FileText, Download, Eye, Plus, Calendar } from "lucide-react";
import Link from "next/link";

export default function MedicalRecordsPage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/medical-records?search=${searchTerm}`);
                const data = await res.json();
                setRecords(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch records", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchRecords, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-500">History of consultations, labs, and prescriptions.</p>
                </div>
                {/* 
                <Link 
                    href="/dashboard/records/new" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Record
                </Link>
                */}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by patient name or document ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 bg-white text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        Filter Type
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 bg-white text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        Date Range
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading records...</td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">No records found matching your search.</td></tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{record.patientName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.type === 'CONSULTATION' ? 'bg-blue-100 text-blue-800' :
                                                    record.type === 'LAB_RESULT' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.doctorName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {record.summary}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button className="text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button className="text-gray-400 hover:text-green-600 transition-colors" title="Download PDF">
                                                    <FileText className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
