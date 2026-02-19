import React from 'react';

interface PropertiesPanelProps {
    selectedField: any;
    onChange: (updates: any) => void;
}

export function PropertiesPanel({ selectedField, onChange }: PropertiesPanelProps) {
    if (!selectedField) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center text-gray-400 text-center">
                Select a field to edit its properties
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Edit Field</h3>
                <p className="text-xs text-gray-500">ID: {selectedField.id}</p>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Label</label>
                    <input
                        type="text"
                        value={selectedField.label}
                        onChange={(e) => onChange({ label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        value={selectedField.type}
                        onChange={(e) => onChange({ type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="select">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="textarea">Text Area</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="required"
                        checked={selectedField.required || false}
                        onChange={(e) => onChange({ required: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="required" className="text-sm text-gray-700 font-medium">
                        Required Field
                    </label>
                </div>

                {(selectedField.type === 'select' || selectedField.type === 'checkbox') && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Options (Comma separated)</label>
                        <textarea
                            value={selectedField.options?.join(', ') || ''}
                            onChange={(e) => onChange({ options: e.target.value.split(',').map((s: string) => s.trim()) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-24"
                            placeholder="Option 1, Option 2"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
