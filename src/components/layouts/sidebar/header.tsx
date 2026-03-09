import { Building2 } from "lucide-react";

export function HeaderLogo() {
    return (
        <div className="flex items-center justify-center h-18 border-b bg-white shadow">
            <div className="flex items-center gap-3 px-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-lg font-bold">Mandalika</h1>
                    <p className="text-xs text-gray-500">SAP</p>
                </div>
            </div>
        </div>
    );
}
