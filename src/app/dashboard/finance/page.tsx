"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Plus } from 'lucide-react';
import Link from 'next/link';

export default function FinancePage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/finance/invoices');
            const data = await res.json();
            setInvoices(data || []);
        } catch (error) {
            console.error("Error fetching invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const totalIncome = invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

    const pendingAmount = invoices
        .filter(inv => inv.status !== 'PAID')
        .reduce((sum, inv) => sum + (Number(inv.totalAmount) - Number(inv.paidAmount)), 0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
                    <p className="text-gray-500">Track income and billing</p>
                </div>
                <Link href="/dashboard/finance/new" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm">
                    <Plus className="w-4 h-4" />
                    New Invoice
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <h3 className="text-2xl font-bold text-gray-900">${totalIncome.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <h3 className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Invoices</p>
                            <h3 className="text-2xl font-bold text-gray-900">{invoices.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-700">Recent Invoices</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Invoice #</th>
                            <th className="px-6 py-3">Patient</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                        ) : invoices.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">No invoices found</td></tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono">{inv.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4">{inv.patient?.firstName} {inv.patient?.lastName}</td>
                                    <td className="px-6 py-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-bold">${Number(inv.totalAmount).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            inv.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/finance/${inv.id}`} className="text-blue-600 hover:text-blue-800 font-medium">View</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
