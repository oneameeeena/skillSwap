import type { Route } from "./+types/login";
import { Link, Form, redirect, useActionData, useNavigation } from "react-router";
import { motion } from "framer-motion";
import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function action({ request }: Route.ActionArgs) {
    try {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: "Invalid email or password" };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { error: "Invalid email or password" };
        }

        // For now, we just redirect home. 
        // In a real app, you would set a session cookie here.
        return redirect("/");
    } catch (error: any) {
        console.error("Login error:", error);
        return { error: "An unexpected error occurred during login." };
    }
}

export default function Login() {
    const actionData = useActionData<{ error?: string }>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <span className="font-bold text-xl tracking-tight">SkillSwap</span>
                    </Link>
                    <h2 className="text-2xl font-bold">Welcome back</h2>
                    <p className="text-slate-500">Please enter your details to sign in.</p>
                </div>

                {actionData?.error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                        {actionData.error}
                    </div>
                )}

                <Form method="post" className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email address</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 mt-2 disabled:opacity-70"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </Form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                        Sign up for free
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
