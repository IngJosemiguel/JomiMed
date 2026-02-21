"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchInvoice = React.useCallback(async () => {
        try {
            const res = await fetch(`/api/finance/invoices/${id}`);
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            setInvoice(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchInvoice();
    }, [id, fetchInvoice]);

    const handleMarkAsPaid = async () => {
        const method = prompt("Enter payment method (CASH, CARD, TRANSFER):", "CASH");
        if (!method) return;

        try {
            const res = await fetch(`/api/finance/invoices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'PAID', method }) // Backend handles full balance payment
            });
            if (res.ok) {
                fetchInvoice(); // Refresh
            }
        } catch (error) {
            alert("Error updating invoice");
        }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;
    if (!invoice) return <div className="p-12 text-center text-red-500">Invoice not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/finance" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.id.slice(-6).toUpperCase()}</h1>
                        <p className="text-gray-500">Created on {new Date(invoice.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    {invoice.status !== 'PAID' && (
                        <button
                            onClick={handleMarkAsPaid}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4" /> Record Payment
                        </button>
                    )}
                </div>
            </div>

            {/* Invoice Document Look */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-0">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-teal-600 mb-2">JomiMed</h2>
                        <p className="text-gray-500">123 Health St.</p>
                        <p className="text-gray-500">Lima, Peru</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-2xl font-bold text-gray-900">INVOICE</h3>
                        <p className="text-gray-500 mt-1">#{invoice.id.slice(-6).toUpperCase()}</p>
                        <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase
                            ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700 border border-green-200' :
                                invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                    'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            {invoice.status === 'PAID' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            {invoice.status}
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 pb-8 mb-8 grid grid-cols-2">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h4>
                        <p className="font-bold text-gray-900 text-lg">{invoice.patient?.firstName} {invoice.patient?.lastName}</p>
                        <p className="text-gray-600">{invoice.patient?.documentNumber}</p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dates</h4>
                        <p className="text-gray-600"><span className="font-medium">Issued:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600"><span className="font-medium">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div>
                    <table className="w-full text-left mb-8">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-3 text-sm font-bold text-gray-500 uppercase">Item Description</th>
                                <th className="py-3 text-sm font-bold text-gray-500 uppercase text-right">Qty</th>
                                <th className="py-3 text-sm font-bold text-gray-500 uppercase text-right">Price</th>
                                <th className="py-3 text-sm font-bold text-gray-500 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoice.items?.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="py-4 text-gray-900">{item.description}</td>
                                    <td className="py-4 text-gray-600 text-right">{item.quantity}</td>
                                    <td className="py-4 text-gray-600 text-right">${item.unitPrice.toFixed(2)}</td>
                                    <td className="py-4 text-gray-900 font-bold text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end border-t border-gray-200 pt-8">
                    <div className="w-full md:w-1/3 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${Number(invoice.totalAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Amount Paid</span>
                            <span>${Number(invoice.paidAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                            <span>Balance Due</span>
                            <span>${(Number(invoice.totalAmount) - Number(invoice.paidAmount)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
