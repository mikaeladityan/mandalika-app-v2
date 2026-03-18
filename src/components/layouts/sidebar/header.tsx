import { Building2 } from "lucide-react";

export function HeaderLogo() {
    return (
        <div className="flex items-center justify-center h-16 border-b border-white/5 bg-sidebar font-sans">
            <div className="flex items-center gap-3 px-4 outline-none">
                <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform hover:rotate-2">
                    <Building2 className="size-5.5" />
                </div>
                <div className="leading-tight">
                    <h1 className="text-base font-black tracking-tight text-white/95">Mandalika</h1>
                    <p className="text-[10px] uppercase font-bold text-primary tracking-[0.2em]">
                        ERP SYSTEM
                    </p>
                </div>
            </div>
        </div>
    );
}
