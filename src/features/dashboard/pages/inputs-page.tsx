import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useInputs } from '../hooks/use-inputs';
import { InputList } from '../components/input-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { CreateInputModal } from '../components/create-input-modal';

export function InputsPage() {
  const { inputs, ingredients, packages, isLoading, handleEdit, handleDelete, handleCreate, isCreateModalOpen, setIsCreateModalOpen, fetchInputs } = useInputs();
  const { setAction } = useDashboardAction();

  const [activeTab, setActiveTab] = useState<'ingredient' | 'package'>('ingredient');


  useEffect(() => {
    setAction({
      label: 'Cadastrar insumo',
      icon: <Plus className="w-5 h-5" strokeWidth={3} />,
      onClick: handleCreate,
    });


    return () => setAction(null);
  }, [setAction, handleCreate]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto relative">
      <div className="flex justify-center w-full border-b border-gray-300 mb-4 sticky top-0 bg-bg-body z-20 pt-4 bg-bg-body">
        <button
          onClick={() => setActiveTab('ingredient')}
          className={`flex-1 md:flex-none pb-3 px-6 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'ingredient'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'
            }`}
        >
          Ingredientes
        </button>
        <button
          onClick={() => setActiveTab('package')}
          className={`flex-1 md:flex-none pb-3 px-6 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'package'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'
            }`}
        >
          Embalagens
        </button>
      </div>

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'ingredient' && (
          <InputList
            inputs={ingredients}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'package' && (
          <InputList
            inputs={packages}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <CreateInputModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchInputs}
      />
    </div>
  );
}