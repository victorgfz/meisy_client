import { TrendingDown, TrendingUp } from "lucide-react"
import type { PreviousMonthReport } from "../types/reports.types"
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { REPORTS_CONSTANTS } from "../constants/reports.constants";

interface PreviousMonthsReportCardProps {
    data: PreviousMonthReport[]
}

function PreviousMonthsReportCard({data}: PreviousMonthsReportCardProps) {
    const formattedCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    const isIncrease = (value: number) => value > 1 ? true : false
    const formattedVariationRate = (value: number) => ((value -1) * 100).toFixed(2)
    const monthName = (value: number) => format(subMonths(new Date(), value) , 'MMMM', {locale: ptBR}) 

    return (<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-shadow flex flex-col gap-6">
        <div className="py-2">
            <h2 className="text-2xl font-bold mb-1">Últimos 3 meses</h2>
            <div className="flex flex-col gap-2 justify-start items-center">

            {data && data.length > 0 ?
            data.map((item, index) => (
            <div className="flex flex-col gap-2 w-full bg-gray-100 rounded p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-md text-gray-800 font-bold capitalize">{monthName(index+1)}</h3>
                    <p className="text-xs text-gray-400 font-light">{item.quantityOfOrders} pedidos ({item.quantityOfCompletedOrders} concluídos)</p>
                </div>
                <table className="min-w-full divide-y divide-gray-300 text-center border border-gray-300">
                    <thead>
                        <tr>
                        <th className="p-1 text-[8px] uppercase font-bold text-gray-700">Faturamento</th>
                        <th className="p-1 text-[8px] uppercase font-bold text-gray-700 border-l border-gray-300">Custos</th>
                        <th className="p-1 text-[8px] uppercase font-bold text-gray-700 border-l border-gray-300">Lucro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                        {/* Faturamento */}
                        <td className="p-1 align-top">
                            <div className="flex flex-col items-center">
                            <p className="text-xs">{formattedCurrency(item.totalRevenue)}</p>
                            {isIncrease(item.totalRevenueVariationRate) ? (
                                <span className="text-green-500 text-[8px] flex items-center gap-1">
                                +{formattedVariationRate(item.totalRevenueVariationRate)}%
                                <TrendingUp size={10} />
                                </span>
                            ) : (
                                <span className="text-red-500 text-[8px] flex items-center gap-1">
                                {formattedVariationRate(item.totalRevenueVariationRate)}%
                                <TrendingDown size={10} />
                                </span>
                            )}
                            </div>
                        </td>

                        {/* Custos */}
                        <td className="p-1 align-top border-l border-gray-300">
                            <div className="flex flex-col items-center">
                            <p className="text-xs">{formattedCurrency(item.totalCosts)}</p>
                            {isIncrease(item.totalCostsVariationRate) ? (
                                <span className="text-red-500 text-[8px] flex items-center gap-1">
                                +{formattedVariationRate(item.totalCostsVariationRate)}%
                                <TrendingUp size={10} />
                                </span>
                            ) : (
                                <span className=" text-green-500 text-[8px] flex items-center gap-1">
                                {formattedVariationRate(item.totalCostsVariationRate)}%
                                <TrendingDown size={10} />
                                </span>
                            )}
                            </div>
                        </td>

                        {/* Lucro */}
                        <td className="p-1 align-top border-l border-gray-300">
                            <div className="flex flex-col items-center">
                            <p className="text-xs">{formattedCurrency(item.totalProfit)}</p>
                            {isIncrease(item.totalProfitVariationRate) ? (
                                <span className="text-green-500 text-[8px] flex items-center gap-1">
                                +{formattedVariationRate(item.totalProfitVariationRate)}%
                                <TrendingUp size={10} />
                                </span>
                            ) : (
                                <span className="text-red-500 text-[8px] flex items-center gap-1">
                                {formattedVariationRate(item.totalProfitVariationRate)}%
                                <TrendingDown size={10} />
                                </span>
                            )}
                            </div>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>)) :
            (<p className="p-4 rounded bg-gray-100 text-sm ">{REPORTS_CONSTANTS.empty}</p>)}
            </div>


        </div>

    </div>)
} 

export default PreviousMonthsReportCard