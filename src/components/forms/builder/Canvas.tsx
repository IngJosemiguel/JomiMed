import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';

interface Field {
    id: string;
    type: string;
    label: string;
    required?: boolean;
}

interface CanvasProps {
    fields: Field[];
    onSelectField: (id: string) => void;
    selectedFieldId: string | null;
    onDeleteField: (id: string) => void;
}

export function Canvas({ fields, onSelectField, selectedFieldId, onDeleteField }: CanvasProps) {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
            <div
                ref={setNodeRef}
                className="max-w-3xl mx-auto bg-white min-h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4"
            >
                {fields.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Drag and drop fields here to build your form
                    </div>
                ) : (
                    <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                        {fields.map((field) => (
                            <SortableField
                                key={field.id}
                                field={field}
                                isSelected={selectedFieldId === field.id}
                                onSelect={() => onSelectField(field.id)}
                                onDelete={() => onDeleteField(field.id)}
                            />
                        ))}
                    </SortableContext>
                )}
            </div>
        </div>
    );
}

function SortableField({ field, isSelected, onSelect, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group flex items-start gap-4 p-4 border rounded-md cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
            onClick={onSelect}
        >
            <div {...attributes} {...listeners} className="mt-1 cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="h-9 bg-gray-100 border border-gray-200 rounded w-full"></div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{field.type}</p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
