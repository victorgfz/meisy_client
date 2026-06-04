import { TrendingDown, TrendingUp } from "lucide-react"
import type { PreviousMonthReport } from "../types/reports.types"
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PreviousMonthsReportCardProps {
    data: PreviousMonthReport[]
}

function PreviousMonthsReportCard({data}: PreviousMonthsReportCardProps) {
    const formattedCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    const isIncrease = (value: number) => value > 1 ? true : false
    const formattedVariationRate = (value: number) => (value -1) * 100
    const monthName = (value: number) => format(subMonths(new Date(), value) , 'MMMM', {locale: ptBR}) 

    return (<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-shadow flex flex-col gap-6">
        <div className="py-2">
            <h2 className="text-2xl font-bold mb-1">Últimos 3 meses</h2>
            <div className="flex flex-col gap-2 justify-start items-center">

            {data && data.length > 0 ?
            data.map((item, index) => (<div className="flex items-center justify-between w-full bg-gray-100 rounded p-4">
                <div>
                    <h3 className="text-md text-gray-800 font-bold capitalize">{monthName(index+1)}</h3>
                    <p className="text-xs text-gray-400 font-light">{item.quantityOfOrders} pedidos ({item.quantityOfCompletedOrders} concluídos)</p>
                </div>
                <div className="flex justify-end items-start divide-x-[1px] divide-gray-300">
                    <div className="text-center flex flex-col items-center gap-1 px-2">
                        <p className="text-[8px] uppercase font-bold">Faturamento</p>
                        <p className="text-xs">{formattedCurrency(item.totalRevenue)}</p>
                        
                            {isIncrease(item.totalRevenueVariationRate) ?
                            <span className="text-green-500 text-[10px] flex items-center gap-1">
                                +{formattedVariationRate(item.totalRevenueVariationRate).toFixed(2)}%
                                <TrendingUp size={12} />
                            </span>
                            : 
                            <span className="text-red-500 text-[10px] flex items-center gap-1">
                                {formattedVariationRate(item.totalRevenueVariationRate).toFixed(2)}%
                                <TrendingDown size={12} />
                            </span>
                            }
                        
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 px-2">
                        <p className="text-[8px] uppercase font-bold">Custos</p>
                        <p className="text-xs">{formattedCurrency(item.totalCosts)}</p>
                        
                            {isIncrease(item.totalCostsVariationRate) ?
                            <span className="text-green-500 text-[10px] flex items-center gap-1">
                                +{formattedVariationRate(item.totalCostsVariationRate).toFixed(2)}%
                                <TrendingUp size={12} />
                            </span>
                            : 
                            <span className="text-red-500 text-[10px] flex items-center gap-1">
                                {formattedVariationRate(item.totalCostsVariationRate).toFixed(2)}%
                                <TrendingDown size={12} />
                            </span>
                            }
                        
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 px-2">
                        <p className="text-[8px] uppercase font-bold">Lucro</p>
                        <p className="text-xs">{formattedCurrency(item.totalProfit)}</p>
                        
                            {isIncrease(item.totalProfitVariationRate) ?
                            <span className="text-green-500 text-[10px] flex items-center gap-1">
                                +{formattedVariationRate(item.totalProfitVariationRate).toFixed(2)}%
                                <TrendingUp size={12} />
                            </span>
                            : 
                            <span className="text-red-500 text-[10px] flex items-center gap-1">
                                {formattedVariationRate(item.totalProfitVariationRate).toFixed(2)}%
                                <TrendingDown size={12} />
                            </span>
                            }
                        
                    </div>
                </div>
            </div>)) :
            (<p className="p-4 rounded bg-gray-100 text-sm ">Nenhum dado disponível para o período</p>)}
            </div>


        </div>

    </div>)
} 

export default PreviousMonthsReportCard