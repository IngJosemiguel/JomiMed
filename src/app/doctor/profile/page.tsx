"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { User, Phone, Mail, Award, FileText, Save, Loader2 } from 'lucide-react';

export default function DoctorProfilePage() {
    const { user: authUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        medicalLicense: ''
    });

    useEffect(() => {
        if (authUser?.id) {
            fetchProfile();
        }
    }, [authUser]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/users/${authUser?.id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    specialization: data.specialization || '',
                    medicalLicense: data.medicalLicense || ''
                });
            }
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/users/${authUser?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    specialization: formData.specialization,
                    medicalLicense: formData.medicalLicense
                })
            });

            if (res.ok) {
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading profile...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-500 mb-8">Manage your account settings and professional details.</p>

            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    {/* Header with Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-4xl border-4 border-white shadow-sm">
                            {formData.firstName[0]}{formData.lastName[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-teal-600 font-medium">{formData.specialization || 'Medical Doctor'}</p>
                            <span className="inline-flex items-center gap-1 text-gray-500 text-sm mt-1">
                                <Award className="w-4 h-4" />
                                {formData.medicalLicense ? `License: ${formData.medicalLicense}` : 'No license info'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Personal Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full pl-10 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full pl-10 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Professional Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-10 h-10 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                        className="w-full pl-10 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="e.g. Cardiology"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical License ID</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.medicalLicense}
                                        onChange={e => setFormData({ ...formData, medicalLicense: e.target.value })}
                                        className="w-full pl-10 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="e.g. CMP-12345"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
