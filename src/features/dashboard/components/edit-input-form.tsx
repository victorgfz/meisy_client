import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import type { EditInputFormValues } from '../hooks/use-edit-input';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { ServerErrorMessages } from '../../../components/server-error-messages';

const { form: formConstants } = INPUTS_CONSTANTS;

interface EditInputFormProps {
  form: UseFormReturn<EditInputFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: EditInputFormValues) => void;
  onCancel: () => void;
}

export function EditInputForm({
  form,
  isLoading,
  serverErrors,
  onSubmit,
  onCancel,
}: EditInputFormProps) {
  const { register, watch, formState: { errors }, setValue } = form;
  const inputType = watch('inputType');

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.,]/g, "").replace(',', '.');
    setValue("amount", value, { shouldValidate: true });
  };


  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="flex flex-col gap-6 w-full mt-2">

      {serverErrors && <ServerErrorMessages message={serverErrors} />}

      {/* Radio Buttons for Type */}
      <fieldset className="flex items-center justify-center gap-6 border-none p-0 m-0 opacity-70">
        <label className="flex items-center gap-2 cursor-not-allowed group">
          <input
            type="radio"
            value="ingredient"
            {...register('inputType')}
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 accent-primary pointer-events-none"
            tabIndex={-1}
            disabled={true}
          />
          <span className="text-sm font-medium text-gray-700">{formConstants.ingredient}</span>
        </label>
        <label className="flex items-center gap-2 cursor-not-allowed group">
          <input
            type="radio"
            value="packaging"
            {...register('inputType')}
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 accent-primary pointer-events-none"
            tabIndex={-1}
            disabled={true}

          />
          <span className="text-sm font-medium text-gray-700">{formConstants.packaging}</span>
        </label>
      </fieldset>

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
              {...register('amount', { onChange: handleAmountChange })}
              placeholder={formConstants.amountPlaceholder}
              className="w-full py-3 px-4 outline-none text-gray-800 min-w-0"
            />
            <select
              {...register('measurementUnit')}
              className="border-l border-gray-200 bg-gray-100 py-3 px-3 outline-none text-gray-700 text-sm font-medium cursor-not-allowed pointer-events-none h-full border-y-0 opacity-80"
              tabIndex={-1}
            >
              {inputType === 'ingredient' ? (
                <>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="un">un</option>
                </>
              ) : (
                <option value="un">un</option>
              )}
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
