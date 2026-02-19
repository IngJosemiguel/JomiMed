"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import FormRenderer from '@/components/forms/renderer/FormRenderer';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId: string;
}

export default function ConsultationModal({ isOpen, onClose, onSuccess, patientId }: ConsultationModalProps) {
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/settings/forms/templates');
            const data = await res.json();
            setTemplates(data || []);
        } catch (error) {
            console.error("Error fetching templates", error);
        }
    };

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/medical-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    type: selectedTemplate ? selectedTemplate.type : "CONSULTATION",
                    content: formData
                }),
            });

            if (!res.ok) throw new Error('Failed to save record');

            onSuccess();
            onClose();
        } catch (error) {
            alert("Error saving record");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        New Consultation
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {!selectedTemplate ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700">Select a Template</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template)}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition"
                                    >
                                        <span className="font-bold text-gray-800 block">{template.name}</span>
                                        <span className="text-sm text-gray-500">{template.type}</span>
                                    </button>
                                ))}

                                {templates.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        No templates found. Please configure them in Settings.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-800">{selectedTemplate.name}</h3>
                                <button onClick={() => setSelectedTemplate(null)} className="text-sm text-blue-600 hover:underline">
                                    Change Template
                                </button>
                            </div>
                            {/* Assumes content is an array of fields. If it's a JSON object structure, we might need parsing logic here */}
                            <FormRenderer
                                fields={Array.isArray(selectedTemplate.content) ? selectedTemplate.content : []}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
