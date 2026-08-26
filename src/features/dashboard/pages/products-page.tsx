import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useProducts } from '../hooks/use-products';
import { ProductList } from '../components/product-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { CreateProductModal } from '../components/create-product-modal';
import { ProductDetailsModal } from '../components/product-details-modal';
import { EditProductModal } from '../components/edit-product-modal';
import { DeleteProductModal } from '../components/delete-product-modal';
import { useToast } from '../../../hooks/use-toast';
import { FilterBar } from '../components/filter-bar';
import { useInputs } from '../hooks/use-inputs';
import { useFilterSort } from '../hooks/use-filter-sort';
import type { Product, ProductDetail } from '../types/products.types';
import { productsService } from '../services/products.service';

export function ProductsPage() {
  const {
    products, isLoading, handleEdit, handleDelete, handleCreate, handleViewDetail,
    fetchProducts, isCreateModalOpen, setIsCreateModalOpen,
    isDetailModalOpen, setIsDetailModalOpen, selectedProductId, isEditModalOpen, setIsEditModalOpen, itemToEdit,
    isDeleteModalOpen, setIsDeleteModalOpen, itemToDelete
  } = useProducts();

  const { inputs } = useInputs();
  const { setAction } = useDashboardAction();
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
    const map = new Map<number, Set<number>>();
    for (const detail of productDetails) {
      const detailInputs = detail.productInputs ?? [];
      const inputIds = new Set(detailInputs.map((pi) => pi.id));
      map.set(detail.id, inputIds);
    }
    return map;
  }, [productDetails]);

  // Filter groups: by insumo
  const filterGroups = useMemo(() => {
    const inputOptions = inputs.map((i) => ({
      label: i.description,
      value: String(i.id),
    }));

    if (inputOptions.length === 0) return [];

    return [
      { label: 'Por Insumo', options: inputOptions },
    ];
  }, [inputs]);

  // Filter function: show products that use any of the selected inputs
  const filterFn = useCallback(
    (product: Product, activeFilters: string[]) => {
      const inputIds = productInputMap.get(product.id);
      if (!inputIds) return false;
      return activeFilters.some((inputId) => inputIds.has(Number(inputId)));
    },
    [productInputMap]
  );

  // Sort function
  const sortFn = useCallback((a: Product, b: Product, sortKey: string) => {
    switch (sortKey) {
      case 'alpha-asc':
        return a.description.localeCompare(b.description, 'pt-BR');
      case 'alpha-desc':
        return b.description.localeCompare(a.description, 'pt-BR');
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'updated-desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'updated-asc':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      default:
        return 0;
    }
  }, []);

  const {
    processedItems,
    activeFilters,
    activeSort,
    setActiveFilters,
    setActiveSort,
    clearFilters,
    hasActiveFilters,
  } = useFilterSort<Product>({
    items: products,
    filterFn,
    sortFn,
    defaultSort: 'alpha-asc',
  });

  const handleSuccessCreate = () => {
    fetchProducts();
    toast(PRODUCTS_CONSTANTS.messages.successAdd, 'success', 4000);
  };

  const handleSuccessEdit = () => {
    fetchProducts();
    toast(PRODUCTS_CONSTANTS.messages.successEdit, 'success', 4000);
  };

  const handleSuccessDelete = () => {
    fetchProducts();
    toast(PRODUCTS_CONSTANTS.messages.successDelete, 'success', 4000);
  };

  useEffect(() => {
    setAction({
      label: PRODUCTS_CONSTANTS.actions.create,
      icon: <Plus className="w-5 h-5" strokeWidth={3} />,
      onClick: handleCreate,
    });

    return () => setAction(null);
  }, [setAction, handleCreate]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto relative pt-6">

      <FilterBar
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        sortOptions={PRODUCTS_CONSTANTS.filterSort.sortOptions}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ProductList
          products={processedItems}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
        />
      </section>

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccessCreate}
      />

      <ProductDetailsModal
        isOpen={isDetailModalOpen}
        productId={selectedProductId}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        productId={itemToEdit?.id || null}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccessEdit}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccessDelete}
      />
    </div>
  );
}
