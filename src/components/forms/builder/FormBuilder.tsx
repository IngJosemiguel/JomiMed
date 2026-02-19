"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Trash2, Type, CheckSquare, Calendar, Hash, AlignLeft } from "lucide-react";

// Field Types
const FIELD_TYPES = [
    { type: "TEXT", label: "Short Text", icon: Type },
    { type: "TEXTAREA", label: "Long Text", icon: AlignLeft },
    { type: "NUMBER", label: "Number", icon: Hash },
    { type: "DATE", label: "Date", icon: Calendar },
    { type: "CHECKBOX", label: "Checkbox", icon: CheckSquare },
];

interface FormField {
    id: string;
    type: string;
    label: string;
    required: boolean;
}

// Draggable Item Component
function SortableItem({ field, onDelete }: { field: FormField; onDelete: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors cursor-move">
            <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{field.type}</span>
                    <p className="font-medium text-gray-900 mt-1">{field.label}</p>
                </div>
            </div>
            <button
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                onClick={() => onDelete(field.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function FormBuilder() {
    const [fields, setFields] = useState<FormField[]>([
        { id: "1", type: "TEXT", label: "Reason for Visit", required: true },
        { id: "2", type: "TEXTAREA", label: "Symptoms Description", required: false },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addField = (type: string) => {
        const label = prompt("Enter field label (e.g. 'Allergies'):");
        if (!label) return;

        const newField: FormField = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            label,
            required: false
        };
        setFields([...fields, newField]);
    };

    const deleteField = (id: string) => {
        if (confirm("Remove this field?")) {
            setFields(fields.filter(f => f.id !== id));
        }
    };

    return (
        <div className="flex h-[calc(100vh-200px)] gap-6">
            {/* Sidebar: Field Types */}
            <div className="w-64 bg-gray-50 p-4 rounded-xl border border-gray-200 h-full overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Toolbox</h3>
                <div className="space-y-2">
                    {FIELD_TYPES.map((ft) => (
                        <button
                            key={ft.type}
                            onClick={() => addField(ft.type)}
                            className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                        >
                            <div className="p-2 bg-gray-100 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <ft.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{ft.label}</span>
                            <Plus className="w-4 h-4 ml-auto text-gray-300 group-hover:text-blue-500" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas: Form Preview */}
            <div className="flex-1 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto bg-white min-h-full shadow-sm rounded-xl p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Patient Intake Form</h2>
                        <p className="text-gray-500">Customize the fields required for new patient registration.</p>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                                {fields.map((field) => (
                                    <SortableItem key={field.id} field={field} onDelete={deleteField} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {fields.length === 0 && (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                            <p>Drag and drop fields here or click + to add</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
