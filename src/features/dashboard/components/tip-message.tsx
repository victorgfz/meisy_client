import { Lightbulb } from 'lucide-react';

export function TipMessage({ message }: { message: string }) {
    return (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 w-full mt-1 transition-all duration-300 animate-fade-in">
            <Lightbulb className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <p className="text-sm leading-relaxed">{message}</p>
        </div>
    );
}
