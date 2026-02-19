"use client";

import { useState } from "react";
import { Building2, Lock, Bell, Globe, Save, FileText } from "lucide-react";
import FormBuilder from "@/components/forms/builder/FormBuilder";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h2>
                <p className="text-gray-500">Manage your clinic preferences and system configurations.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Navigation */}
                <aside className="w-full md:w-64 space-y-2">
                    {[
                        { id: "profile", label: "Clinic Profile", icon: Building2 },
                        { id: "forms", label: "Form Customization", icon: FileText },
                        { id: "security", label: "Security", icon: Lock },
                        { id: "notifications", label: "Notifications", icon: Bell },
                        { id: "preferences", label: "System Preferences", icon: Globe },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`} />
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <div className={`flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${activeTab === 'forms' ? 'bg-transparent border-none shadow-none p-0' : 'min-h-[500px]'}`}>

                    {activeTab === "profile" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Clinic Profile</h3>
                                <p className="text-sm text-gray-500">Update your organization's public information.</p>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="JomiMed Clinic" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="+1 (555) 000-0000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="https://jomimed.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} defaultValue="123 Medical Center Dr, Suite 100" />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "forms" && (
                        <div className="animate-in fade-in duration-300 h-full">
                            <FormBuilder />
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                                <p className="text-sm text-gray-500">Manage your password and access controls.</p>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="pt-2">
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Enable Two-Factor Authentication</button>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
                                        <Save className="w-4 h-4" />
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "preferences" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">System Preferences</h3>
                                <p className="text-sm text-gray-500">Customize your regional settings.</p>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                                        <option>UTC (Coordinated Universal Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                        <option>PST (Pacific Standard Time)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
                                        <Save className="w-4 h-4" />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
