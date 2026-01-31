"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// 建议安装 lucide-react: npm install lucide-react
import {
  Settings,
  Mail,
  Calendar,
  Bell,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserPreferences {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { user } = useAuth();

  async function fetchPreferences() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user-preferences");
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleUpdatePreferences = () => {
    router.push("/select");
  };

  const handleDeactivateNewsletter = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: false }),
      });

      if (response.ok) {
        setPreferences((prev) => (prev ? { ...prev, is_active: false } : null));
        alert("Newsletter deactivated successfully");
      }
    } catch (error) {
      console.error("Error deactivating newsletter:", error);
      alert("Failed to deactivate newsletter");
    }
  };

  const handleActivateNewsletter = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: true }),
      });

      if (response.ok) {
        setPreferences((prev) => (prev ? { ...prev, is_active: true } : null));
        alert("Newsletter activated successfully");
      }
    } catch (error) {
      console.error("Error activating newsletter:", error);
      alert("Failed to activate newsletter");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600 text-lg">
              Manage your personalized newsletter subscriptions.
            </p>
          </div>
        </div>

        {isLoading ? (
          /* Loading State (Skeleton) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-white rounded-2xl border border-slate-200"
              />
            ))}
          </div>
        ) : preferences ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">
                    Subscription Details
                  </h2>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      preferences.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {preferences.is_active ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </>
                    )}
                  </span>
                </div>

                <div className="p-6 space-y-8">
                  {/* Categories Tags */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Interest Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {preferences.categories.map((category) => (
                        <span
                          key={category}
                          className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-default"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Grid Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-indigo-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Delivery Email
                        </p>
                        <p className="text-slate-900 font-semibold">
                          {preferences.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-indigo-600">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Frequency
                        </p>
                        <p className="text-slate-900 font-semibold capitalize">
                          {preferences.frequency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Actions
              </h2>

              <div className="space-y-4">
                <button
                  onClick={handleUpdatePreferences}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Update Preferences
                </button>

                {preferences && (
                  <>
                    {preferences.is_active ? (
                      <button
                        onClick={handleDeactivateNewsletter}
                        className="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                          />
                        </svg>
                        Pause Newsletter
                      </button>
                    ) : (
                      <button
                        onClick={handleActivateNewsletter}
                        className="w-full flex items-center justify-center px-4 py-3 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Resume Newsletter
                      </button>
                    )}
                  </>
                )}

                <Link
                  href="/subscribe"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Manage Subscription
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No active subscription
            </h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">
              You haven't set your newsletter preferences yet. Let's get you
              started!
            </p>
            <Link
              href="/select"
              className="inline-flex items-center px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Set Up Newsletter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
