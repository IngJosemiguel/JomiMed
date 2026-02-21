"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus } from 'lucide-react';
import CreateAppointmentModal from "@/components/appointments/CreateAppointmentModal";

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function MedicalCalendar() {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const start = new Date(new Date().getFullYear(), 0, 1).toISOString();
        const end = new Date(new Date().getFullYear(), 11, 31).toISOString();

        try {
            const res = await fetch(`/api/appointments?start=${start}&end=${end}`);
            const data = await res.json();

            const formattedEvents = data.map((appt: any) => ({
                id: appt.id,
                title: `${appt.patient.firstName} - ${appt.reason || 'Consultation'}`,
                start: new Date(appt.datetime),
                end: new Date(new Date(appt.datetime).getTime() + appt.duration * 60000),
                resource: appt,
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const handleSelectSlot = (slotInfo: { start: Date }) => {
        setSelectedDate(slotInfo.start);
        setIsModalOpen(true);
    };

    return (
        <div className="h-[calc(100vh-100px)] bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Medical Agenda</h2>
                <button
                    onClick={() => { setSelectedDate(new Date()); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    New Appointment
                </button>
            </div>

            <div className="flex-1">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    defaultView="week"
                    views={['month', 'week', 'day']}
                    selectable
                    onSelectSlot={handleSelectSlot}
                />
            </div>

            <CreateAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
                initialDate={selectedDate}
            />
        </div>
    );
}
