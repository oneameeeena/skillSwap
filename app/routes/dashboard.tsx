import type { Route } from "./+types/dashboard";
import { Link, redirect } from "react-router";
import { prisma } from "../db.server";

// Simple auth check (in a real app, use sessions)
export async function loader({ request }: Route.LoaderArgs) {
    // This is a placeholder for session check
    // If not logged in, redirect to login
    return {};
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <span className="font-bold text-xl tracking-tight">SkillSwap</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">User Panel</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <Link to="/login" className="text-sm text-red-600 hover:underline">Log out</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Dashboard</h1>
                    <p className="text-slate-500">Manage your skills and swaps here.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-2">My Skills</h3>
                        <p className="text-slate-500 text-sm mb-4">Display your current skills here.</p>
                        <button className="text-indigo-600 font-medium hover:underline text-sm">+ Add Skill</button>
                    </div>
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-2">Pending Swaps</h3>
                        <p className="text-slate-500 text-sm">You have no pending requests.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
