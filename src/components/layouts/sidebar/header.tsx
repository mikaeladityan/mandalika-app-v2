import { Building2 } from "lucide-react";

export function HeaderLogo() {
    return (
        <div className="flex flex-col h-auto pt-[22px] px-[22px] pb-[18px] border-b border-white/5 bg-sidebar font-sans">
            <div className="flex items-center gap-3 outline-none">
                <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform hover:rotate-2">
                    <Building2 className="size-5.5" />
                </div>
                <div className="leading-tight">
                    <h1 className="text-[16px] font-black tracking-tight text-white/95 leading-none">Mandalika</h1>
                    <p className="text-[10px] uppercase font-extrabold text-[#71717A] tracking-[0.12em] mt-1.5">
                        System Shell
                    </p>
                </div>
            </div>
        </div>
    );
}
