import { CheckCircle2 } from "lucide-react";

export function SuccessMessage({ message }: { message: string }) {
    return (
        <div className="flex animate-in fade-in slide-in-from-top-2 items-center gap-2 p-3.5 mx-4 md:mx-0 mb-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
}