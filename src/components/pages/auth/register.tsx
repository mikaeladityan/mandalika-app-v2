"use client";

import { RegisterRequestDTO, RegisterSchema } from "@/app/auth/server/schema";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Loader2,
    UserCheck,
    ArrowLeft,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { InputForm } from "@/components/ui/form/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form/main";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { zxcvbn } from "@zxcvbn-ts/core";

export function Register() {
    const { isLoading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, isPending } = useFormAuth();

    const form = useForm<RegisterRequestDTO>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    });

    const onSubmit = async (data: RegisterRequestDTO) => {
        await register(data);
    };

    if (isAuthenticated) {
        window.location.replace("/");
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-slate-500 font-medium animate-pulse text-sm">
                    Menghubungkan ke Server...
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="z-10 w-full max-w-[500px]"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6 transition-transform hover:rotate-3">
                        <Sparkles className="size-8" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-[26px] font-black tracking-tight text-[#0F172A] leading-none mb-2">
                            Mandalika
                        </h1>
                        <p className="text-[10px] uppercase font-extrabold text-[#71717A] tracking-[0.14em]">
                            System Shell
                        </p>
                    </div>
                </div>

                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-[#E2E8F0] dark:border-zinc-800 p-[22px] rounded-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
                    <Form
                        methods={form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <InputForm
                                required
                                control={form.control}
                                name="first_name"
                                label="Nama Depan"
                                placeholder="John"
                                autoFocus
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/10"
                                error={form.formState.errors.first_name}
                            />
                            <InputForm
                                control={form.control}
                                name="last_name"
                                label="Nama Belakang"
                                placeholder="Doe"
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/10"
                                error={form.formState.errors.last_name}
                            />
                        </div>

                        <InputForm
                            required
                            control={form.control}
                            name="email"
                            label="Alamat Email"
                            placeholder="nama@perusahaan.com"
                            type="email"
                            className="h-11 transition-all focus:ring-2 focus:ring-primary/10"
                            error={form.formState.errors.email}
                        />

                        <div className="space-y-3">
                            <InputForm
                                control={form.control}
                                name="password"
                                label="Kata Sandi Baru"
                                placeholder="Min. 8 karakter"
                                type={showPassword ? "text" : "password"}
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/10"
                                error={form.formState.errors.password}
                                showVisibilityToggle
                                onToggleVisibility={() => setShowPassword(!showPassword)}
                                isVisible={showPassword}
                            />

                            <AnimatePresence>
                                {form.watch("password") && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <PasswordStrengthMeter password={form.watch("password")} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <InputForm
                            control={form.control}
                            name="confirm_password"
                            label="Konfirmasi Kata Sandi"
                            placeholder="Ulangi kata sandi"
                            type={showConfirmPassword ? "text" : "password"}
                            className="h-11 transition-all focus:ring-2 focus:ring-primary/10"
                            error={form.formState.errors.confirm_password}
                            showVisibilityToggle
                            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                            isVisible={showConfirmPassword}
                        />

                        <div className="pt-2">
                            <Button
                                disabled={isPending || !form.formState.isValid}
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-extrabold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group"
                            >
                                {isPending ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin w-5 h-5 text-white" />
                                        <span>Mendaftarkan...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <ShieldCheck
                                            size={20}
                                            className="group-hover:scale-110 transition-transform"
                                        />
                                        <span>Daftar Sekarang</span>
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-2">
                            <span className="text-sm text-slate-400">Sudah punya akun?</span>
                            <Link
                                href="/auth"
                                className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 hover:underline underline-offset-4"
                            >
                                Masuk ke Sini
                            </Link>
                        </div>
                    </Form>
                </div>

                <Link
                    href="/"
                    className="mt-8 mx-auto w-fit flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-100"
                >
                    <ArrowLeft size={16} />
                    Kembali Beranda
                </Link>
            </motion.div>
        </div>
    );
}

export const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const [strength, setStrength] = useState(0);
    const [requirements, setRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasSymbol: false,
        hasNumber: false,
        hasLetter: false,
    });

    useEffect(() => {
        if (!password) {
            setStrength(0);
            setRequirements({
                minLength: false,
                hasUppercase: false,
                hasSymbol: false,
                hasNumber: false,
                hasLetter: false,
            });
            return;
        }

        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);

        setRequirements({ minLength, hasUppercase, hasSymbol, hasNumber, hasLetter });

        const result = zxcvbn(password);
        setStrength(result.score);
    }, [password]);

    const getStrengthLabel = () => {
        if (strength <= 1)
            return { text: "Sangat Lemah", color: "text-[#DC2626]", bg: "bg-[#DC2626]" };
        if (strength === 2) return { text: "Cukup", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]" };
        if (strength === 3) return { text: "Kuat", color: "text-[#10B981]", bg: "bg-[#10B981]" };
        return { text: "Sangat Aman", color: "text-[#10B981]", bg: "bg-[#10B981]" };
    };

    const label = getStrengthLabel();

    return (
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kekuatan Sandi
                </span>
                <span
                    className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full bg-white border shadow-sm",
                        label.color,
                    )}
                >
                    {label.text}
                </span>
            </div>

            <div className="flex gap-1.5 mb-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-300",
                            i <= strength ? label.bg : "bg-slate-200",
                        )}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <RequirementItem label="Min. 8 Karakter" met={requirements.minLength} />
                <RequirementItem label="Huruf Besar" met={requirements.hasUppercase} />
                <RequirementItem
                    label="Simbol & Angka"
                    met={requirements.hasSymbol && requirements.hasNumber}
                />
                <RequirementItem label="Kombinasi Huruf" met={requirements.hasLetter} />
            </div>
        </div>
    );
};

const RequirementItem = ({ label, met }: { label: string; met: boolean }) => (
    <div className="flex items-center gap-2">
        {met ? (
            <CheckCircle2 size={14} className="text-[#10B981]" />
        ) : (
            <XCircle size={14} className="text-[#E2E8F0]" />
        )}
        <span
            className={cn(
                "text-[11px] font-medium transition-colors",
                met ? "text-slate-700" : "text-slate-400",
            )}
        >
            {label}
        </span>
    </div>
);
