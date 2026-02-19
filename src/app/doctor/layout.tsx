"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Stethoscope,
    Calendar,
    Users,
    LogOut,
    Settings,
    ClipboardList
} from "lucide-react";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const links = [
        { name: "My Agenda", href: "/doctor", icon: Calendar },
        { name: "My Patients", href: "/doctor/patients", icon: Users },
        { name: "Consultation History", href: "/doctor/history", icon: ClipboardList },
        { name: "Profile Settings", href: "/doctor/profile", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Doctor Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <div className="px-6 py-6 border-b border-gray-100">
                        <Link href="/doctor" className="flex items-center gap-3">
                            <div className="bg-teal-600 rounded-lg p-2">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 leading-tight">JomiMed</h1>
                                <p className="text-xs text-teal-600 font-medium">Doctor Portal</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="p-4 space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? "bg-teal-50 text-teal-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "text-teal-600" : "text-gray-400"}`} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign out
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {links.find(l => l.href === pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                            DR
                        </div>
                        <span className="text-sm font-medium text-gray-700">Dr. Session</span>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
