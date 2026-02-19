"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FormRenderer from '@/components/forms/renderer/FormRenderer';

interface CreatePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreatePatientModal({ isOpen, onClose, onSuccess }: CreatePatientModalProps) {
    const [customFields, setCustomFields] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCustomFields();
        }
    }, [isOpen]);

    const fetchCustomFields = async () => {
        try {
            const res = await fetch('/api/settings/forms/fields?entityType=PATIENT');
            const data = await res.json();
            setCustomFields(data || []);
        } catch (error) {
            console.error("Error fetching custom fields", error);
        }
    };

    const handleSubmit = async (formData: any) => {
        setLoading(true);

        // Separate standard fields from custom data
        const standardFields = ['firstName', 'lastName', 'documentNumber', 'dateOfBirth', 'email', 'phone'];
        const payload: any = { customData: {} };

        Object.entries(formData).forEach(([key, value]) => {
            if (standardFields.includes(key)) {
                payload[key] = value;
            } else {
                payload.customData[key] = value;
            }
        });

        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create patient');
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

    // Merge standard fields with custom fields for the renderer
    const allFields = [
        { id: 'firstName', label: 'First Name', type: 'text', required: true },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true },
        { id: 'documentNumber', label: 'DNI / Document', type: 'text', required: true },
        { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'email', label: 'Email', type: 'text' },
        { id: 'phone', label: 'Phone', type: 'text' },
        ...customFields
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">New Patient</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <FormRenderer fields={allFields} onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}
