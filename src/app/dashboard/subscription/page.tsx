"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, HardDrive, Users, UserPlus } from 'lucide-react';

export default function SubscriptionPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/subscription');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading subscription details...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load subscription data.</div>;

    const { plan, status, limits, invoices } = data;

    const getProgressColor = (used: number, max: number) => {
        const percentage = (used / max) * 100;
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-blue-600';
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
                    <p className="text-gray-500">Manage your plan and usage limits</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status}
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition">
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* Current Plan Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Current Plan</p>
                            <h2 className="text-3xl font-bold">{plan} TIER</h2>
                            <p className="text-gray-300 mt-2 text-sm">Valid until {new Date(data.periodEnd).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Patients Usage */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Patients</span>
                            <span>{limits.patients.used} / {limits.patients.max}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getProgressColor(limits.patients.used, limits.patients.max)} transition-all duration-500`}
                                style={{ width: `${Math.min((limits.patients.used / limits.patients.max) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">Active patient records</p>
                    </div>

                    {/* Users Usage */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Team Members</span>
                            <span>{limits.users.used} / {limits.users.max}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getProgressColor(limits.users.used, limits.users.max)} transition-all duration-500`}
                                style={{ width: `${Math.min((limits.users.used / limits.users.max) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">Doctors and staff accounts</p>
                    </div>

                    {/* Storage Usage */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span className="flex items-center gap-2"><HardDrive className="w-4 h-4" /> Storage</span>
                            <span>{(limits.storage.used / 1024 / 1024).toFixed(0)}MB / {(limits.storage.max / 1024 / 1024).toFixed(0)}MB</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getProgressColor(limits.storage.used, limits.storage.max)} transition-all duration-500`}
                                style={{ width: `${Math.min((limits.storage.used / limits.storage.max) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">Files and attachments</p>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Description</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.map((inv: any) => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">{new Date(inv.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-600">{inv.description}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">${inv.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3" /> Paid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
