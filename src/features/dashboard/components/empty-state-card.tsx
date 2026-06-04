import type { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}

export function EmptyStateCard({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateCardProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-gray-300 w-full mx-auto text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Icon size={50} className='text-primary' />
            <div className="flex flex-col gap-2"> 
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-500 mx-auto leading-relaxed">
                    {description}
                </p>
            </div>
            <button
                onClick={onAction}
                className="px-8 py-4 mt-2 rounded-xl bg-primary text-white font-bold tracking-wider hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-sm border-none cursor-pointer"
            >
                {actionLabel}
            </button>
        </div>
    );
}
