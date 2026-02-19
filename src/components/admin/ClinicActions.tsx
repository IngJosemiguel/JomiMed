"use client";

import { useState } from "react";
import { MoreVertical, Ban, Trash2, CheckCircle } from "lucide-react";

interface ClinicActionsProps {
    clinic: any;
    onRefresh: () => void;
}

export default function ClinicActions({ clinic, onRefresh }: ClinicActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const newStatus = clinic.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
            await fetch(`/api/admin/clinics/${clinic.id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                        <button
                            onClick={toggleStatus}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                            {clinic.status === 'ACTIVE' ? (
                                <>
                                    <Ban className="w-4 h-4 text-orange-500" />
                                    <span className="text-orange-700">Suspend Clinic</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-green-700">Activate Clinic</span>
                                </>
                            )}
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                            <Trash2 className="w-4 h-4" />
                            Delete Data
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
