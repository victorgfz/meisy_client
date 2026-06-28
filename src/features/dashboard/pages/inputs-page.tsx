import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useInputs } from '../hooks/use-inputs';
import { InputList } from '../components/input-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { CreateInputModal } from '../components/create-input-modal';
import { EditInputModal } from '../components/edit-input-modal';
import { DeleteInputModal } from '../components/delete-input-modal';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';
import { SuccessMessage } from '../components/success-message';
import { OverheadList } from '../components/overhead-list';
import { OverheadModal } from '../components/overhead-modal';
import { useOverheads } from '../hooks/use-overheads';

export function InputsPage() {
  const {
    ingredients, packages, isLoading, handleEdit, handleDelete, handleCreate,
    isCreateModalOpen, setIsCreateModalOpen, fetchInputs,
    isEditModalOpen, setIsEditModalOpen, itemToEdit,
    isDeleteModalOpen, setIsDeleteModalOpen, itemToDelete
  } = useInputs();
  const {
    overheads,
    isLoading: isLoadingOverheads,
    isModalOpen: isOverheadModalOpen,
    selectedType: selectedOverheadType,
    selectedOverhead,
    handleOpenModal: handleOpenOverheadModal,
    handleCloseModal: handleCloseOverheadModal,
    fetchOverheads
  } = useOverheads();
  const { setAction } = useDashboardAction();

  const [activeTab, setActiveTab] = useState<'ingredient' | 'package' | 'overhead'>('ingredient');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccessCreate = () => {
    fetchInputs();
    setSuccessMessage(INPUTS_CONSTANTS.messages.successAdd);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleSuccessEdit = () => {
    fetchInputs();
    setSuccessMessage(INPUTS_CONSTANTS.messages.successEdit);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleSuccessDelete = () => {
    fetchInputs();
    setSuccessMessage(INPUTS_CONSTANTS.messages.successDelete);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };
  useEffect(() => {
    setAction({
      label: INPUTS_CONSTANTS.actions.create,
      icon: <Plus className="w-5 h-5" strokeWidth={3} />,
      onClick: handleCreate,
    });

    return () => setAction(null);
  }, [setAction, handleCreate]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto relative">
      <div className="flex justify-center w-full border-b border-gray-300 mb-4 sticky top-0 bg-bg-body z-20 pt-8">
        <button
          onClick={() => setActiveTab('ingredient')}
          className={`flex-1 md:flex-none pb-3 px-6 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'ingredient'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'
            }`}
        >
          Ingredientes
        </button>
        <button
          onClick={() => setActiveTab('package')}
          className={`flex-1 md:flex-none pb-3 px-6 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'package'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'
            }`}
        >
          Embalagens
        </button>
        <button
          onClick={() => setActiveTab('overhead')}
          className={`flex-1 md:flex-none pb-3 px-6 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'overhead'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'
            }`}
        >
          Custos Indiretos
        </button>
      </div>

      {successMessage && <SuccessMessage message={successMessage} />}

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

        {activeTab === 'overhead' && (
          <OverheadList
            overheads={overheads}
            isLoading={isLoadingOverheads}
            onOpenModal={handleOpenOverheadModal}
          />
        )}
      </section>

      <CreateInputModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccessCreate}
      />

      <EditInputModal
        isOpen={isEditModalOpen}
        item={itemToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccessEdit}
      />

      <DeleteInputModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccessDelete}
      />

      <OverheadModal
        isOpen={isOverheadModalOpen}
        onClose={handleCloseOverheadModal}
        onSuccess={() => {
          fetchOverheads();
          setSuccessMessage(OVERHEADS_CONSTANTS.messages.successSave);
          setTimeout(() => setSuccessMessage(null), 4000);
        }}
        type={selectedOverheadType}
        overhead={selectedOverhead}
      />
    </div>
  );
}