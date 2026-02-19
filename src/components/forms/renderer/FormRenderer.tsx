import React from 'react';

interface Field {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
}

interface FormRendererProps {
    fields: Field[];
    onSubmit: (data: any) => void;
}

export default function FormRenderer({ fields, onSubmit }: FormRendererProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
                <div key={field.id} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {renderInput(field)}
                </div>
            ))}

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Submit
            </button>
        </form>
    );
}

function renderInput(field: Field) {
    const commonProps = {
        name: field.id, // Using ID as name might be tricky if we want readable JSON, but good for uniqueness. Ideally we use a 'name' property.
        id: field.id,
        required: field.required,
        placeholder: field.placeholder,
        className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2",
    };

    switch (field.type) {
        case 'text':
            return <input type="text" {...commonProps} />;
        case 'number':
            return <input type="number" {...commonProps} />;
        case 'date':
            return <input type="date" {...commonProps} />;
        case 'textarea':
            return <textarea {...commonProps} rows={3} />;
        case 'select':
            return (
                <select {...commonProps}>
                    <option value="">Select an option</option>
                    {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            );
        case 'checkbox':
            return (
                <div className="flex items-center h-5">
                    <input
                        id={field.id}
                        name={field.id}
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-500">{field.label}</span>
                </div>
            );
        default:
            return <div className="text-red-500">Unknown field type: {field.type}</div>;
    }
}
