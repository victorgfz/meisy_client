import React, { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import type { CreateProductFormInput, CreateProductFormValues } from '../hooks/use-create-product';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { ServerErrorMessages } from '../../../components/server-error-messages';
import { useInputs } from '../hooks/use-inputs';
import type { Input } from '../types/inputs.types';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const { form: formConstants } = PRODUCTS_CONSTANTS;

interface CreateProductFormProps {
  form: UseFormReturn<CreateProductFormInput, any, CreateProductFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: CreateProductFormValues) => void;
  onCancel: () => void;
}

export function CreateProductForm({
  form,
  isLoading,
  serverErrors,
  onSubmit,
  onCancel,
}: CreateProductFormProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, watch, formState: { errors }, setValue } = form;
  const { ingredients, packages, isLoading: isLoadingInputs, fetchInputs } = useInputs();

  // Ensure inputs are loaded
  useEffect(() => {
    fetchInputs();
  }, [fetchInputs]);

  const getInputClass = (hasError: boolean) => {
    return `w-full py-3 px-4 rounded-lg outline-none border transition-all duration-200 ${hasError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/50'}`;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value !== "") {
      value = (parseInt(value, 10) / 100).toFixed(2);
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    setValue("price", value, { shouldValidate: true });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: any) => {
    const sanitizedValue = e.target.value.replace(/[^0-9.,]/g, "").replace(/\./g, ',');
    const [integerPart, ...decimalParts] = sanitizedValue.split(',');
    const value = decimalParts.length > 0
      ? `${integerPart},${decimalParts.join('')}`
      : integerPart;
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic mask for HH:MM:SS
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 6) val = val.substring(0, 6);

    let formatted = val;
    if (val.length > 4) {
      formatted = `${val.substring(0, 2)}:${val.substring(2, 4)}:${val.substring(4)}`;
    } else if (val.length > 2) {
      formatted = `${val.substring(0, 2)}:${val.substring(2)}`;
    }
    setValue("productionTime", formatted, { shouldValidate: true });
  };

   const navigate = useNavigate();

  const renderInputList = (items: Input[], title: string) => {
    if (items.length === 0) return <div className="text-center text-xs p-4 text-text-secondary bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">{PRODUCTS_CONSTANTS.form.noInputs}
    <button className='text-primary underline' onClick={() => navigate('/dashboard/inputs')}>Ir para o cadastro de insumo</button>
    </div>;

    return (
      <details open className="group mt-2">
        <summary className="flex cursor-pointer list-none items-center py-2 text-sm font-semibold text-gray-700 select-none [&::-webkit-details-marker]:hidden">
          <span>{title}</span>
          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-2 pb-1">
          {items.map((item) => {
            const isChecked = watch(`productInputs.${item.id}.isChecked`);
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <input
                  id={`${item.id}`}
                  type="checkbox"
                  {...register(`productInputs.${item.id}.isChecked`)}
                  className="w-4 h-4 shrink-0 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                />
                <label htmlFor={`${item.id}`} className="min-w-0 flex-1 text-sm font-medium text-gray-700">{item.description}</label>

                {isChecked && (
                  <div className="flex h-9 shrink-0 items-center overflow-hidden rounded-lg border border-gray-200 bg-white transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={formConstants.amountInputPlaceholder}
                      {...register(`productInputs.${item.id}.amount`)}
                      onChange={(e) => handleAmountChange(e, `productInputs.${item.id}.amount`)}
                      className="h-full w-20 shrink-0 px-3 text-sm text-gray-800 outline-none"
                    />
                    <select
                      {...register(`productInputs.${item.id}.unit`)}
                      className="h-full w-24 shrink-0 border-l border-gray-200 bg-gray-100 px-2 text-xs font-medium text-gray-700 outline-none cursor-pointer"
                    >
                      {item.type === 0 ? (
                        <>
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="l">l</option>
                          <option value="un">un</option>
                          <option value="tsp">colher de chá</option>
                          <option value="tbscp">colher de sopa</option>
                        </>
                      ) : (
                        <option value="un">un</option>
                      )}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </details>
    );
  };

  const handleFormSubmit = (data: CreateProductFormValues) => {
    const hasIngredient = ingredients.some(ing => data.productInputs?.[ing.id]?.isChecked);
    const hasPackage = packages.some(pkg => data.productInputs?.[pkg.id]?.isChecked);

    if (!hasIngredient || !hasPackage) {
      setLocalError(PRODUCTS_CONSTANTS.validation.hasIngredientAndPackage);
      return;
    }

    setLocalError(null);
    onSubmit(data);
  };

  const allErrors = [];
  if (localError) allErrors.push(localError);
  if (serverErrors) allErrors.push(...serverErrors);

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(handleFormSubmit)(e); }} className="flex flex-col gap-4 w-full mt-2 px-1 pb-4">

      {allErrors.length > 0 && <ServerErrorMessages message={allErrors} />}

      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label htmlFor="description" className="text-sm font-bold text-gray-800 tracking-wide">
          {formConstants.descriptionLabel}
        </label>
        <div className="relative w-full">
          <input
            id="description"
            type="text"
            {...register('description')}
            placeholder={formConstants.descriptionPlaceholder}
            className={getInputClass(!!errors.description)}
          />
        </div>
        {errors.description && (
          <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>
        )}
      </fieldset>

      <div className="flex flex-row gap-4 w-full">
        {/* Quantidade Group */}
        <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0 flex-1">
          <label htmlFor="amount" className="text-sm font-bold text-gray-800 tracking-wide">
            {formConstants.amountLabel}
          </label>
          <div className="flex flex-row items-center border border-gray-200 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-200 overflow-hidden bg-white">
            <input
              id="amount"
              type="text"
              {...register('amount', { onChange: (e) => handleAmountChange(e, 'amount') })}
              placeholder={formConstants.amountPlaceholder}
              className="w-full py-3 px-4 outline-none text-gray-800 min-w-0"
            />
            <select
              {...register('measurementUnit')}
              className="border-l border-gray-200 bg-gray-100 py-3 px-3 outline-none text-gray-700 text-sm font-medium cursor-pointer h-full border-y-0"
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="un">un</option>
            </select>
          </div>
          {errors.amount && (
            <span className="text-red-500 text-xs mt-1">{errors.amount.message}</span>
          )}
        </fieldset>

        {/* Preço Group */}
        <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0 w-[45%]">
          <label htmlFor="price" className="text-sm font-bold text-gray-800 tracking-wide">
            {formConstants.priceLabel}
          </label>
          <div className="flex flex-row items-center border border-gray-200 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-200 overflow-hidden bg-white">
            <div className="bg-gray-100 py-3 px-4 border-r border-gray-200 text-gray-500 font-medium whitespace-nowrap">
              R$
            </div>
            <input
              id="price"
              type="text"
              {...register('price', { onChange: handlePriceChange })}
              placeholder={formConstants.pricePlaceholder}
              className="w-full py-3 px-3 outline-none text-gray-800"
            />
          </div>
          {errors.price && (
            <span className="text-red-500 text-xs mt-1">{errors.price.message}</span>
          )}
        </fieldset>
      </div>

      <div className="h-px w-full bg-gray-200 mb-2 relative mt-6">
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm font-bold text-primary">
          {formConstants.recipeSubtitle}
        </span>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {isLoadingInputs ? (
          <p className="text-sm text-gray-500">Carregando insumos...</p>
        ) : (
          <>
            {renderInputList(ingredients, formConstants.ingredientsSubtitle)}
            {renderInputList(packages, formConstants.packagingSubtitle)}
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full">
        <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0 flex-1">
          <label htmlFor="productionTime" className="text-sm font-bold text-gray-800 tracking-wide">
            {formConstants.productionTimeLabel}
          </label>
          <div className="relative w-full">
            <input
              id="productionTime"
              type="text"
              {...register('productionTime', { onChange: handleTimeChange })}
              placeholder={formConstants.productionTimePlaceholder}
              className={getInputClass(!!errors.productionTime)}
            />
          </div>
          {errors.productionTime && (
            <span className="text-red-500 text-xs mt-1">{errors.productionTime.message}</span>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0 flex-1">
          <label htmlFor="servings" className="text-sm font-bold text-gray-800 tracking-wide">
            {formConstants.servingsLabel}
          </label>
          <div className="relative w-full">
            <input
              id="servings"
              type="text"
              {...register('servings', { onChange: (e) => handleAmountChange(e, 'servings') })}
              placeholder={formConstants.servingsPlaceholder}
              className={getInputClass(!!errors.servings)}
            />
          </div>
          {errors.servings && (
            <span className="text-red-500 text-xs mt-1">{errors.servings.message}</span>
          )}
        </fieldset>
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
