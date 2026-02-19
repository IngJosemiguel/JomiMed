"use client";

import Link from "next/link";
import { User, LogOut, Calendar, FileText, Home } from "lucide-react";

export default function PatientPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/portal" className="flex items-center gap-2">
                                <div className="bg-blue-600 rounded-lg p-1.5">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg text-gray-900">JomiMed Portal</span>
                            </Link>

                            <div className="hidden md:flex space-x-4">
                                <Link href="/portal" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                    <Home className="w-4 h-4" /> Home
                                </Link>
                                <Link href="/portal/appointments" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                    <Calendar className="w-4 h-4" /> Appointments
                                </Link>
                                <Link href="/portal/records" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                    <FileText className="w-4 h-4" /> My Records
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/portal/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
                                    ME
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">My Profile</span>
                            </Link>
                            <Link href="/api/auth/logout" className="text-gray-500 hover:text-red-600 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                    &copy; 2026 JomiMed Health. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
