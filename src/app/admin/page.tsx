"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, Users, Activity, Search, Filter, ShieldCheck, AlertCircle } from "lucide-react";
import ClinicActions from "@/components/admin/ClinicActions";
import CreateClinicModal from "@/components/admin/CreateClinicModal";

export default function SuperAdminDashboard() {
    const [clinics, setClinics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchClinics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/clinics');
            const data = await res.json();
            setClinics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch clinics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    const activeClinics = clinics.filter(c => c.status === 'ACTIVE').length;
    const totalUsers = clinics.reduce((acc, curr) => acc + (curr.users || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 rounded-lg p-1.5">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">JomiMed <span className="text-gray-400 font-normal">Admin</span></span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 pr-4 border-r border-gray-200 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> System Operational</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium shadow-sm ring-2 ring-gray-100 cursor-pointer">
                                SA
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Page Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Platform Overview
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">Manage clinics, subscriptions, and system health.</p>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="ml-3 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
                        >
                            <Plus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                            Onboard Clinic
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Active Clinics', value: activeClinics, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Monthly Revenue', value: '$0', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'System Issues', value: '0', icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50' },
                    ].map((stat) => (
                        <div key={stat.label} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:border-blue-100 transition-all group">
                            <dt>
                                <div className={`absolute rounded-md p-3 ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">{stat.label}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            </dd>
                        </div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search clinics..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter Status
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-200">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Clinic</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-4">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading clinics...</td></tr>
                                    ) : clinics.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-8 text-gray-500">No clinics found. Create one to get started.</td></tr>
                                    ) : (
                                        clinics.map((clinic) => (
                                            <tr key={clinic.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                                                {clinic.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{clinic.name}</div>
                                                            <div className="text-xs text-gray-500">ID: {clinic.id.substring(0, 8)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${clinic.plan === 'ENTERPRISE' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                                                            clinic.plan === 'PRO' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                                'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                        }`}>
                                                        {clinic.plan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {clinic.users}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {clinic.revenue}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${clinic.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${clinic.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`} />
                                                        {clinic.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <ClinicActions clinic={clinic} onRefresh={fetchClinics} />
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <CreateClinicModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchClinics}
                />
            </main>
        </div>
    );
}
