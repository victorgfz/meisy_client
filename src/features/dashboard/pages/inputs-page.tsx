import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useInputs } from '../hooks/use-inputs';
import { InputList } from '../components/input-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { CreateInputModal } from '../components/create-input-modal';
import { EditInputModal } from '../components/edit-input-modal';
import { DeleteInputModal } from '../components/delete-input-modal';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';
import { OverheadList } from '../components/overhead-list';
import { OverheadModal } from '../components/overhead-modal';
import { useOverheads } from '../hooks/use-overheads';
import { useToast } from '../../../hooks/use-toast';
import { FilterBar } from '../components/filter-bar';
import { useProducts } from '../hooks/use-products';
import { useFilterSort } from '../hooks/use-filter-sort';
import type { Input } from '../types/inputs.types';
import type { ProductDetail } from '../types/products.types';
import { productsService } from '../services/products.service';

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
  const { products } = useProducts();
  const { setAction } = useDashboardAction();

  const [activeTab, setActiveTab] = useState<'ingredient' | 'package' | 'overhead'>('ingredient');
  const toast = useToast();

  // Fetch product details to get productInputs (list endpoint doesn't include them)
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

  useEffect(() => {
    if (products.length === 0) return;

    const fetchAllDetails = async () => {
      try {
        const details = await Promise.all(
          products.map((p) => productsService.getById(p.id))
        );
        setProductDetails(details);
      } catch (error) {
        console.error('Erro ao carregar detalhes dos produtos para filtro:', error);
      }
    };

    fetchAllDetails();
  }, [products]);

  // Build a Set of inputIds per product for efficient lookup
  const productInputMap = useMemo(() => {
    const map = new Map<string, Set<number>>();
    for (const detail of productDetails) {
      const inputs = detail.productInputs ?? [];
      const inputIds = new Set(inputs.map((pi) => pi.id));
      map.set(String(detail.id), inputIds);
    }
    return map;
  }, [productDetails]);

  // Filter groups: organized by category
  const filterGroups = useMemo(() => {
    const productOptions = products.map((p) => ({
      label: p.description,
      value: String(p.id),
    }));

    if (productOptions.length === 0) return [];

    return [
      { label: 'Por Produto', options: productOptions },
    ];
  }, [products]);

  // Filter function: show inputs whose id is in any selected product's productInputs
  const filterFn = useCallback(
    (item: Input, activeFilters: string[]) => {
      return activeFilters.some((productId) => {
        const inputIds = productInputMap.get(productId);
        return inputIds?.has(item.id) ?? false;
      });
    },
    [productInputMap]
  );

  // Sort function
  const sortFn = useCallback((a: Input, b: Input, sortKey: string) => {
    switch (sortKey) {
      case 'alpha-asc':
        return a.description.localeCompare(b.description, 'pt-BR');
      case 'alpha-desc':
        return b.description.localeCompare(a.description, 'pt-BR');
      case 'cost-asc':
        return a.price - b.price;
      case 'cost-desc':
        return b.price - a.price;
      case 'updated-desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'updated-asc':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      default:
        return 0;
    }
  }, []);

  // Use the same hook instance for both tabs (state persists across tab switches)
  const {
    processedItems,
    activeFilters,
    activeSort,
    setActiveFilters,
    setActiveSort,
    clearFilters,
    hasActiveFilters,
  } = useFilterSort<Input>({
    items: activeTab === 'ingredient' ? ingredients : packages,
    filterFn,
    sortFn,
    defaultSort: 'alpha-asc',
  });

  const handleSuccessCreate = () => {
    fetchInputs();
    toast(INPUTS_CONSTANTS.messages.successAdd, 'success', 4000);
  };

  const handleSuccessEdit = () => {
    fetchInputs();
    toast(INPUTS_CONSTANTS.messages.successEdit, 'success', 4000);
  };

  const handleSuccessDelete = () => {
    fetchInputs();
    toast(INPUTS_CONSTANTS.messages.successDelete, 'success', 4000);
  };

  useEffect(() => {
    setAction({
      label: INPUTS_CONSTANTS.actions.create,
      icon: <Plus className="w-5 h-5" strokeWidth={3} />,
      onClick: handleCreate,
    });

    return () => setAction(null);
  }, [setAction, handleCreate]);

  const showFilterBar = activeTab !== 'overhead';

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

      {showFilterBar && (
        <FilterBar
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          sortOptions={INPUTS_CONSTANTS.filterSort.sortOptions}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'ingredient' && (
          <InputList
            inputs={processedItems}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'package' && (
          <InputList
            inputs={processedItems}
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
          fetchOverheads()
          toast(OVERHEADS_CONSTANTS.messages.successSave, 'success', 4000)
        }}
        type={selectedOverheadType}
        overhead={selectedOverhead}
      />
    </div>
  );
}