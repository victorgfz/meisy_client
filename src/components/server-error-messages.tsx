import { AlertCircle } from "lucide-react";

export function ServerErrorMessages({ message }: { message: string[] | null }) {
    return (<div className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl shadow-sm w-full animate-in fade-in slide-in-from-top-2 duration-300 relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0" strokeWidth={2} />
        <div className="flex flex-col divide-y divide-red-200 w-full">
            {message && message.map((msg, i) => <span key={i} className="font-medium py-2">{msg}</span>)}
        </div>
    </div>)
}