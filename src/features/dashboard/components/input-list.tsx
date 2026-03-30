import { InputCard } from './input-card';
import type { Input } from '../types/inputs.types';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';

interface InputListProps {
  inputs: Input[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function InputList({ inputs, isLoading, onEdit, onDelete }: InputListProps) {

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {/* Skeleton loading cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-3xl w-full"></div>
        ))}
      </div>
    );
  }

  if (inputs.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary bg-white rounded-3xl border border-dashed border-gray-200">
        {INPUTS_CONSTANTS.list.empty}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 lg:grid-cols-3">
      {inputs.map((item) => (
        <InputCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
