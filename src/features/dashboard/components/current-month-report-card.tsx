import { TrendingDown, TrendingUp } from "lucide-react"
import { type CurrentMonthReport } from "../types/reports.types"

interface CurrentMonthReportCardProps {
    data: CurrentMonthReport
}



export function CurrentMonthReportCard({data}: CurrentMonthReportCardProps) {
    const formattedCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    const isIncrease = (value: number) => value > 1 ? true : false
    const formattedVariationRate = (value: number) => (value -1) * 100

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-shadow flex flex-col gap-6">
            <div className="py-2">
                <h2 className="text-2xl font-bold mb-1">Mês atual</h2>
                <div className="flex flex-col gap-3">
                    <div>
                        <p className="uppercase text-gray-400 font-semibold text-xs mb-1">pedidos</p>
                        <div className="flex items-center justify-between gap-1 ">
                            <p className="text-xl text-gray-800 leading-none ">
                                {data.quantityOfOrders}
                                {data.quantityOfCompletedOrders > 0 &&
                                <span className="text-gray-500 font-light">
                                (  
                                {data.quantityOfCompletedOrders} concluídos)
                                </span>
                                } 
                            </p>
                            {isIncrease(data.quantityOfOrdersVariationRate) ?
                            <p className="text-green-500 text-xs flex items-center justify-start">
                            +{formattedVariationRate(data.quantityOfOrdersVariationRate).toFixed(2)}%
                            <TrendingUp size={15}/>
                            </p>:
                            <p className="text-red-500 text-xs flex items-center justify-start">
                            {formattedVariationRate(data.quantityOfOrdersVariationRate).toFixed(2)}%
                            <TrendingDown size={15}/>
                            </p>}
                        </div>
                    </div>
                    <div>
                        <p className="uppercase text-gray-400 font-semibold text-xs mb-1">Faturamento</p>
                        <div className="flex items-center justify-between gap-1 ">
                            <p className="text-xl text-gray-800 leading-none ">
                            {formattedCurrency(data.totalRevenue)}
                        
                            </p>
                            {isIncrease(data.totalRevenueVariationRate) ?
                            <p className="text-green-500 text-xs flex items-center gap-1 justify-start">
                            +{formattedVariationRate(data.totalRevenueVariationRate).toFixed(2)}%
                            <TrendingUp size={15}/>
                            </p>:
                            <p className="text-red-500 text-xs flex items-center justify-start">
                            {formattedVariationRate(data.totalRevenueVariationRate).toFixed(2)}%
                            <TrendingDown size={15}/>
                            </p>}
                        </div>
                    </div>
                    <div>
                        <p className="uppercase text-gray-400 font-semibold text-xs mb-1">Custos</p>
                        <div className="flex items-center justify-between gap-1 ">
                            <p className="text-xl text-gray-800 leading-none ">
                            {formattedCurrency(data.totalCosts)}
                        
                            </p>
                            {isIncrease(data.totalCostsVariationRate) ?
                            <p className="text-green-500 text-xs flex items-center gap-1 justify-start">
                            +{formattedVariationRate(data.totalCostsVariationRate).toFixed(2)}%
                            <TrendingUp size={15}/>
                            </p>:
                            <p className="text-red-500 text-xs flex items-center justify-start">
                            {formattedVariationRate(data.totalCostsVariationRate).toFixed(2)}%
                            <TrendingDown size={15}/>
                            </p>}
                        </div>
                    </div>
                    <div>
                        <p className="uppercase text-gray-400 font-semibold text-xs mb-1">Lucro</p>
                        <div className="flex items-center justify-between gap-1 ">
                            <p className="text-xl text-gray-800 leading-none ">
                            {formattedCurrency(data.totalProfit)}
                        
                            </p>
                            {isIncrease(data.totalProfitVariationRate) ?
                            <p className="text-green-500 text-xs flex items-center gap-1 justify-start">
                            +{formattedVariationRate(data.totalProfitVariationRate).toFixed(2)}%
                            <TrendingUp size={15}/>
                            </p>:
                            <p className="text-red-500 text-xs flex items-center justify-start">
                            {formattedVariationRate(data.totalProfitVariationRate).toFixed(2)}%
                            <TrendingDown size={15}/>
                            </p>}
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="py-2">
                <h2 className="text-2xl font-bold mb-1">Produtos mais vendidos</h2>
                <div className="flex flex-col gap-3 ">
                    {data.bestSellingProducts && data.bestSellingProducts.length > 0 ? data.bestSellingProducts.map((item, index) => 
                    (<div key={index} className={`${(index+1) % 2 === 0 ? "bg-white" : "bg-gray-100"} px-2 py-4 relative rounded-md overflow-hidden flex items-center`}>
                        <h3 className="absolute font-bold text-gray-200 -left-5 text-right italic text-7xl">#{index+1}</h3>
                        <p className="ml-20 text-gray-600 text-md flex-1">{item.description}</p>
                        <div className="flex flex-col items-end justify-center">
                            <p className="text-sm text-gray-600 font-light ">{item.total} vendidos</p>
                            <p className="text-xs text-gray-400 font-light ">= {formattedCurrency(item.totalRevenue)}</p>
                        </div>
                        
                    </div>)) :
                    <p className="p-4 rounded bg-gray-100 text-sm ">Nenhum produto vendido até agora</p>
                    }
                </div>
            </div>
        </div>
    )
}