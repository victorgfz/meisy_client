import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useProducts } from '../hooks/use-products';
import { ProductList } from '../components/product-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { SuccessMessage } from '../components/success-message';
import { CreateProductModal } from '../components/create-product-modal';
import { ProductDetailsModal } from '../components/product-details-modal';
import { EditProductModal } from '../components/edit-product-modal';

export function ProductsPage() {
  const {
    products, isLoading, handleEdit, handleDelete, handleCreate, handleViewDetail,
    fetchProducts, isCreateModalOpen, setIsCreateModalOpen,
    isDetailModalOpen, setIsDetailModalOpen, selectedProductId, isEditModalOpen, setIsEditModalOpen, itemToEdit
  } = useProducts();

  const { setAction } = useDashboardAction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // We are creating the success handlers for when the modals are implemented

  const handleSuccessCreate = () => {
    fetchProducts();
    setSuccessMessage(PRODUCTS_CONSTANTS.messages.successAdd);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSuccessEdit = () => {
    fetchProducts();
    setSuccessMessage(PRODUCTS_CONSTANTS.messages.successEdit);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSuccessDelete = () => {
    fetchProducts();
    setSuccessMessage(PRODUCTS_CONSTANTS.messages.successDelete);
    setTimeout(() => setSuccessMessage(null), 4000);
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


      {successMessage && <SuccessMessage message={successMessage} />}

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ProductList
          products={products}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
        />
      </section>

      {/* 
        TODO: Implement the EditProductModal and DeleteProductModal 
        to complete the full CRUD flow, following the same pattern as Inputs.
      */}

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

      {/* 
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccessDelete}
      /> 
      */}
    </div>
  );
}
