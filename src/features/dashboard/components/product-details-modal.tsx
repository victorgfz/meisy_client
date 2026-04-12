import React from 'react';
import { Modal } from './modal';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { useProductDetail } from '../hooks/use-product-detail';
import { MeasurementUnit } from '../types/inputs.types';
import { OverheadType } from '../types/overheads.types';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';
import { Loader2 } from 'lucide-react';
import { ProductionMeasurementUnit } from '../types/products.types';

interface ProductDetailsModalProps {
  isOpen: boolean;
  productId: number | null;
  onClose: () => void;
}

export function ProductDetailsModal({ isOpen, productId, onClose }: ProductDetailsModalProps) {
  const { productDetail, isLoading, error } = useProductDetail(isOpen ? productId : null);

  const getUnitName = (value: number, enumObj: any) => {
    return Object.keys(enumObj).find(key => enumObj[key] === value) || value;
  };

  const getOverheadName = (type: number) => {
    switch (type) {
      case OverheadType.Electricity: return OVERHEADS_CONSTANTS.types.electricity;
      case OverheadType.Labor: return OVERHEADS_CONSTANTS.types.labor;
      case OverheadType.Gas: return OVERHEADS_CONSTANTS.types.gas;
      case OverheadType.Maintenance: return OVERHEADS_CONSTANTS.types.maintenance;
      default: return OVERHEADS_CONSTANTS.types.default;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculateCosts = () => {
    const ingredientsCost = productDetail?.productInputs.filter(pi => pi.type === 0).reduce((acc, pi) => acc + pi.productionPrice, 0) || 0;
    const packagesCost = productDetail?.productInputs.filter(pi => pi.type === 1).reduce((acc, pi) => acc + pi.productionPrice, 0) || 0;
    const overheadsCost = productDetail?.productOverheads.reduce((acc, oh) => acc + oh.totalCost, 0) || 0;
    return ingredientsCost + packagesCost + overheadsCost;
  };

  const ingredients = productDetail?.productInputs.filter(pi => pi.type === 0) || [];
  const packages = productDetail?.productInputs.filter(pi => pi.type === 1) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={PRODUCTS_CONSTANTS.form.detailsModalTitle}>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : productDetail ? (
        <div className="flex flex-col gap-4 w-full mt-2 px-1 pb-4">

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-gray-800 tracking-wide">
              {PRODUCTS_CONSTANTS.form.descriptionLabel}
            </span>
            <div className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
              {productDetail.description}
            </div>
          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                {PRODUCTS_CONSTANTS.form.amountLabel}
              </span>
              <div className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
                {productDetail.amount} {getUnitName(productDetail.measurementUnit, MeasurementUnit)}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-[45%]">
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                {PRODUCTS_CONSTANTS.form.priceLabel}
              </span>
              <div className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-gray-800">
                {formatCurrency(productDetail.price)}
              </div>
            </div>


          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                {PRODUCTS_CONSTANTS.details.servingsLabel}
              </span>
              <div className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
                {productDetail.servings}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-[45%]">
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                {PRODUCTS_CONSTANTS.details.productionTimeLabel}
              </span>
              <div className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-gray-800">
                {productDetail.productionTime}
              </div>
            </div>


          </div>


          {(ingredients.length > 0 || packages.length > 0) && (
            <>
              <div className="h-px w-full bg-gray-200 mb-2 relative mt-6">
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm font-bold text-primary">
                  {PRODUCTS_CONSTANTS.details.costPerServingLabel}
                </span>
              </div>

              {ingredients.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <h4 className="text-sm font-semibold text-gray-700">{PRODUCTS_CONSTANTS.form.ingredientsSubtitle}</h4>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {ingredients.map(ing => (
                      <div key={ing.id} className="flex flex-row items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="text-sm text-gray-700">{ing.description}</span>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-600">{ing.productionAmount} {getUnitName(ing.productionMeasurementUnit, ProductionMeasurementUnit)}</span>
                          <span className="text-sm text-red-600">{formatCurrency(ing.productionPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {packages.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <h4 className="text-sm font-semibold text-gray-700">{PRODUCTS_CONSTANTS.form.packagingSubtitle}</h4>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {packages.map(pkg => (
                      <div key={pkg.id} className="flex flex-row items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="text-sm text-gray-700">{pkg.description}</span>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm text-gray-600">{pkg.productionAmount} {getUnitName(pkg.productionMeasurementUnit, ProductionMeasurementUnit)}</span>
                          <span className="text-sm text-red-600">{formatCurrency(pkg.productionPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-2 mt-2">
            <h4 className="text-sm font-semibold text-gray-700">{PRODUCTS_CONSTANTS.details.overheadsSubtitle}</h4>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {productDetail.productOverheads.map(oh => (
                <div key={oh.id} className="flex flex-row items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <span className="text-sm text-gray-700">{getOverheadName(oh.type)}</span>
                  <span className="text-sm text-red-600">{formatCurrency(oh.totalCost)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 mb-2 relative mt-6">
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm font-bold text-primary">
              {PRODUCTS_CONSTANTS.details.totalPerServingLabel}
            </span>
          </div>


          <div className="flex items-center justify-center gap-3">
            <div className='bg-red-50 border-[1px] border-red-200 rounded-lg flex-1 p-4 flex flex-col items-center justify-center gap-2'>
              <span className='text-red-900 text-[10px] uppercase leading-none'>Custos</span>
              <span className='text-red-600 text-md leading-none'>{formatCurrency(calculateCosts())}</span>
            </div>
            <div className='bg-green-50 border-[1px] border-green-200 rounded-lg flex-1 p-4 flex flex-col items-center justify-center gap-2'>
              <span className='text-green-900 text-[10px] uppercase leading-none'>Líquido</span>
              <span className='text-green-600 text-md leading-none'>{formatCurrency(productDetail.price - calculateCosts())}</span>
            </div>

          </div>


        </div>

      ) : null}
    </Modal>
  );
}
