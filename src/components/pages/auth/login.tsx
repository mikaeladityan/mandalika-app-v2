"use client";

import { LoginRequestDTO, LoginSchema } from "@/app/auth/server/schema";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Key, Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { InputForm } from "@/components/ui/form/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form/main";
import Link from "next/link";
import { motion } from "framer-motion";

export function Login() {
    const { isLoading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { login, isPending } = useFormAuth();

    const form = useForm<LoginRequestDTO>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (data: LoginRequestDTO) => {
        await login(data);
    };

    const handleToggleRememberMe = () => {
        form.setValue("remember", !form.getValues("remember"));
    };

    if (isAuthenticated) {
        window.location.replace("/");
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
                <p className="text-slate-500 font-medium animate-pulse text-sm">
                    Menyiapkan Sesi Anda...
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-[440px]"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-200">
                        <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                        Mandalika <span className="text-blue-600">ERP</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Sistem Manajemen Bisnis & Inventaris
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-slate-800">Selamat Datang</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Silakan masuk untuk mengakses dashboard Anda
                        </p>
                    </div>

                    <Form
                        methods={form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-4">
                            <div className="relative">
                                <InputForm
                                    required
                                    control={form.control}
                                    name="email"
                                    label="Alamat Email"
                                    placeholder="nama@perusahaan.com"
                                    type="email"
                                    autoFocus
                                    className="pl-3 h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                    error={form.formState.errors.email}
                                />
                            </div>

                            <div className="relative">
                                <InputForm
                                    control={form.control}
                                    name="password"
                                    label="Kata Sandi"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-3 h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                    error={form.formState.errors.password}
                                    showVisibilityToggle
                                    onToggleVisibility={() => setShowPassword(!showPassword)}
                                    isVisible={showPassword}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <button
                                type="button"
                                onClick={handleToggleRememberMe}
                                className="group flex items-center gap-2.5 outline-none"
                            >
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-5 h-5 border-2 rounded-md transition-all duration-200",
                                        form.watch("remember")
                                            ? "bg-blue-600 border-blue-600"
                                            : "bg-white border-slate-200 group-hover:border-blue-300",
                                    )}
                                >
                                    {form.watch("remember") && (
                                        <Check size={14} strokeWidth={3} className="text-white" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        form.watch("remember")
                                            ? "text-blue-700"
                                            : "text-slate-500 group-hover:text-slate-700",
                                    )}
                                >
                                    Ingat saya
                                </span>
                            </button>

                            {process.env.NEXT_PUBLIC_CAN_REGISTER && (
                                <Link
                                    href="/auth/register"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-all"
                                >
                                    Daftar Akun Baru
                                </Link>
                            )}
                        </div>

                        <Button
                            disabled={isPending || !form.formState.isValid}
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Key size={18} strokeWidth={2.5} />
                                    <span>Masuk Sekarang</span>
                                </div>
                            )}
                        </Button>
                    </Form>
                </div>

                <p className="text-center text-slate-400 text-xs mt-10">
                    &copy; {new Date().getFullYear()} Mandalika Parfumery. Semua Hak Dilindungi.
                </p>
            </motion.div>
        </div>
    );
}
