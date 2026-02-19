"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Users,
    Calendar,
    Settings,
    Activity,
    LogOut,
    CreditCard,
    ChevronRight,
    Command,
    ShieldCheck
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: "Overview", href: "/dashboard", icon: Home },
        { name: "Patients", href: "/dashboard/patients", icon: Users },
        { name: "Agenda", href: "/dashboard/appointments", icon: Calendar },
        { name: "Records", href: "/dashboard/records", icon: Activity },
        { name: "Finance", href: "/dashboard/finance", icon: CreditCard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
        { name: "Platform Admin", href: "/admin", icon: ShieldCheck },
    ];

    return (
        <div className="flex h-screen w-64 flex-col justify-between border-r border-gray-200 bg-white">
            {/* Brand */}
            <div className="px-5 py-6">
                <Link href="/dashboard" className="flex items-center gap-2 mb-8">
                    <div className="bg-blue-600 rounded-lg p-1.5">
                        <Command className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 tracking-tight">JomiMed</span>
                </Link>

                <div className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Menu
                </div>

                <ul className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        {link.name}
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 text-blue-500" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white">
                        DR
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">Dr. Admin</p>
                        <p className="text-xs text-gray-500 truncate">admin@demo.com</p>
                    </div>
                </div>
                <Link
                    href="/api/auth/logout"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </Link>
            </div>
        </div>
    );
}
