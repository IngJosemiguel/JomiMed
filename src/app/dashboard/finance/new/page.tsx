"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Search } from 'lucide-react';
import Link from 'next/link';

export default function CreateInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);

    // Form State
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([
        { description: 'Consultation Fee', quantity: 1, unitPrice: 0 }
    ]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await fetch('/api/patients?limit=100');
            const data = await res.json();
            setPatients(data.data || []);
        } catch (error) {
            console.error("Error fetching patients", error);
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/finance/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatientId,
                    dueDate: new Date(dueDate).toISOString(),
                    items: items
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create invoice');
            }

            // Success
            router.push('/dashboard/finance');
        } catch (error) {
            console.error(error);
            alert("Error creating invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/finance" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
                {/* Patient & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                        <select
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                        >
                            <option value="">Select a patient...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.firstName} {p.lastName} - {p.documentNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                            type="date"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Line Items */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                        Invoice Items
                        <span className="text-sm font-medium text-gray-500">Add services or medications</span>
                    </h3>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        required
                                        className="w-full p-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full p-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full p-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="w-32 text-right font-bold text-gray-700">
                                    ${(item.quantity * item.unitPrice).toFixed(2)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-4 flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800"
                    >
                        <Plus className="w-4 h-4" /> Add Line Item
                    </button>
                </div>

                {/* Footer Totals */}
                <div className="border-t border-gray-200 pt-6 flex justify-end">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (0%)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || calculateTotal() === 0 || !selectedPatientId}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Generate Invoice
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
