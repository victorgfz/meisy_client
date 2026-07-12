import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import type { UpsertOverheadFormValues } from '../hooks/use-upsert-overhead';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';
import { ServerErrorMessages } from '../../../components/server-error-messages';
import { HelperMessage } from '../../../components/helper-message';

interface OverheadFormProps {
  form: UseFormReturn<UpsertOverheadFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  type: number | null;
  onSubmit: (values: UpsertOverheadFormValues) => void;
  onCancel: () => void;
}

export function OverheadForm({
  form,
  isLoading,
  serverErrors,
  type,
  onSubmit,
  onCancel,
}: OverheadFormProps) {
  const { register, formState: { errors }, setValue } = form;

  const getTipMessage = () => {
    // 0: Electricity, 1: Labor, 2: Gas, 3: Maintenance
    switch (type) {
      case 0: return OVERHEADS_CONSTANTS.tips.electricity;
      case 1: return OVERHEADS_CONSTANTS.tips.labor;
      case 2: return OVERHEADS_CONSTANTS.tips.gas;
      case 3: return OVERHEADS_CONSTANTS.tips.maintenance;
      default: return OVERHEADS_CONSTANTS.tips.default;
    }
  };

  const getInputClass = (hasError: boolean) => {
    return `w-full py-3 px-4 rounded-r-lg outline-none border transition-all duration-200 border-l-0 ${hasError
      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
      : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/50'
      }`;
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Keep numbers only
    value = value.replace(/\D/g, "");
    if (value !== "") {
      value = (parseInt(value, 10) / 100).toFixed(2);
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    setValue("costPerHour", value, { shouldValidate: true });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="flex flex-col gap-4 w-full mt-2">
      {serverErrors && <ServerErrorMessages message={serverErrors} />}

      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0 w-full">
        <label htmlFor="costPerHour" className="text-sm font-bold text-gray-800 tracking-wide">
          {OVERHEADS_CONSTANTS.labels.costPerHourInputLabel}
        </label>

        <div className="flex flex-row items-center rounded-lg overflow-hidden bg-white w-full">
          <div className="bg-gray-100 py-3 px-4 border border-gray-200 border-r-0 text-gray-500 font-medium whitespace-nowrap rounded-l-lg">
            R$
          </div>
          <input
            id="costPerHour"
            type="text"
            {...register('costPerHour', { onChange: handleCostChange })}
            placeholder={OVERHEADS_CONSTANTS.placeholders.costPerHour}
            className={getInputClass(!!errors.costPerHour)}
          />
        </div>
        {errors.costPerHour && (
          <span className="text-red-500 text-xs mt-1">{errors.costPerHour.message}</span>
        )}
      </fieldset>

      <HelperMessage
        triggerLabel={OVERHEADS_CONSTANTS.actions.tip}
        message={getTipMessage()}
      />


      <div className="flex flex-col gap-3 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-success text-white text-base font-bold tracking-wider cursor-pointer hover:bg-success-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-none"
        >
          {isLoading ? OVERHEADS_CONSTANTS.actions.saving : OVERHEADS_CONSTANTS.actions.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-700 text-base font-bold tracking-wider cursor-pointer hover:bg-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none"
        >
          {OVERHEADS_CONSTANTS.actions.cancel}
        </button>
      </div>
    </form>
  );
}
