import React, { useEffect, useState, useMemo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import type { CreateOrderFormValues } from '../hooks/use-create-order';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { ServerErrorMessages } from '../../../components/server-error-messages';
import { useProducts } from '../hooks/use-products';
import { type Product } from '../types/products.types';

const { form: formConstants } = ORDERS_CONSTANTS;

interface CreateOrderFormProps {
  form: UseFormReturn<CreateOrderFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: CreateOrderFormValues) => void;
  onCancel: () => void;
}

export function CreateOrderForm({
  form,
  isLoading,
  serverErrors,
  onSubmit,
  onCancel,
}: CreateOrderFormProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, watch, getValues, formState: { errors }, setValue } = form;
  const { products, isLoading: isLoadingProducts, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getInputClass = (hasError: boolean) => {
    return `w-full py-3 px-4 rounded-lg outline-none border transition-all duration-200 ${hasError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/50'}`;
  };

  const handleFormSubmit = (data: CreateOrderFormValues) => {
    const hasProducts = products.some(p => {
      const amount = parseFloat((data.orderProducts?.[p.id]?.amount || '0').toString().replace(/\./g, '').replace(',', '.'));
      return !isNaN(amount) && amount > 0;
    });

    if (!hasProducts) {
      setLocalError(ORDERS_CONSTANTS.validation.hasProducts);
      return;
    }

    setLocalError(null);
    onSubmit(data);
  };

  const allErrors = [];
  if (localError) allErrors.push(localError);
  if (serverErrors) allErrors.push(...serverErrors);

  // Calculate total price dynamically
  const watchedAmounts = watch(products.map(p => `orderProducts.${p.id}.amount`) as any[]);

  let totalPrice = 0;
  products.forEach((product, index) => {
    const amountStr = watchedAmounts[index];
    if (amountStr) {
      const amount = parseFloat(String(amountStr).replace(/\./g, '').replace(',', '.'));
      if (!isNaN(amount) && amount > 0) {
        totalPrice += product.price * amount;
      }
    }
  });

  const handleIncrement = (itemId: number) => {
    const current = parseFloat(getValues(`orderProducts.${itemId}.amount`) || '0');
    if (!isNaN(current)) {
      setValue(`orderProducts.${itemId}.amount`, (current + 1).toString(), { shouldValidate: true });
    } else {
      setValue(`orderProducts.${itemId}.amount`, '1', { shouldValidate: true });
    }
  };

  const handleDecrement = (itemId: number) => {
    const current = parseFloat(getValues(`orderProducts.${itemId}.amount`) || '0');
    if (!isNaN(current) && current > 0) {
      setValue(`orderProducts.${itemId}.amount`, (current - 1).toString(), { shouldValidate: true });
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const renderProductList = (items: Product[], title: string) => {
    if (items.length === 0) return null;

    return (
      <div className="flex flex-col gap-3 mt-2">
        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item) => {
            return (
              <div key={item.id} className="flex flex-row items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-primary/30 transition-colors">
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-bold text-gray-800">{item.description}</span>
                  <span className="text-xs text-primary">{formatPrice(item.price)}</span>
                </div>

                <div className="flex flex-row items-center border border-gray-300 rounded-lg transition-all bg-white h-10 w-32 overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleDecrement(item.id)}
                    className="h-full w-10 text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center cursor-pointer border-r border-gray-200 transition-colors font-bold text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register(`orderProducts.${item.id}.amount`)}
                    className="w-full h-full text-center outline-none text-gray-800 text-sm font-bold p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
                  />
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.id)}
                    className="h-full w-10 text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center cursor-pointer border-l border-gray-200 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(handleFormSubmit)(e); }} className="flex flex-col gap-4 w-full mt-2 px-1 pb-4">

      {allErrors.length > 0 && <ServerErrorMessages message={allErrors} />}

      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label htmlFor="deliveryDate" className="text-sm font-bold text-gray-800 tracking-wide">
          {formConstants.deliveryDateLabel}
        </label>
        <div className="relative w-full">
          <input
            id="deliveryDate"
            type="datetime-local"
            {...register('deliveryDate')}
            className={getInputClass(!!errors.deliveryDate)}
          />
        </div>
        {errors.deliveryDate && (
          <span className="text-red-500 text-xs mt-1">{errors.deliveryDate.message}</span>
        )}
      </fieldset>

      <div className="h-px w-full bg-gray-200 mb-2 relative mt-6">
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm font-bold text-primary">
          {formConstants.productsSubtitle}
        </span>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {isLoadingProducts ? (
          <p className="text-sm text-gray-500">Carregando produtos...</p>
        ) : (
          renderProductList(products, "")
        )}
      </div>

      <div className="flex flex-row items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-base font-bold text-gray-700">{formConstants.totalLabel}:</span>
        <span className="text-lg text-primary">{formatPrice(totalPrice)}</span>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-success text-white text-base font-bold tracking-wider cursor-pointer hover:bg-success-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-none"
        >
          {isLoading ? formConstants.savingButton : formConstants.saveButton}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-700 text-base font-bold tracking-wider cursor-pointer hover:bg-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none"
        >
          {formConstants.cancelButton}
        </button>
      </div>

    </form>
  );
}
