import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Hash, Calendar, List, CheckSquare, AlignLeft } from 'lucide-react';

const fieldTypes = [
    { type: 'text', label: 'Text Field', icon: Type },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'select', label: 'Dropdown', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'textarea', label: 'Text Area', icon: AlignLeft },
];

export function Toolbox() {
    return (
        <div className="p-4 bg-white border-r border-gray-200 w-64 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Components</h3>
            <div className="space-y-2">
                {fieldTypes.map((field) => (
                    <DraggableTool key={field.type} field={field} />
                ))}
            </div>
        </div>
    );
}

function DraggableTool({ field }: { field: any }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `toolbox-${field.type}`,
        data: {
            type: 'toolbox-item',
            fieldType: field.type,
            defaultLabel: field.label,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const Icon = field.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md cursor-grab hover:border-blue-500 hover:shadow-sm transition-all shadow-sm"
        >
            <Icon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
        </div>
    );
}
