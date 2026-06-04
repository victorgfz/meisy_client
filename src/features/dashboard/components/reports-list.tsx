import { REPORTS_CONSTANTS } from "../constants/reports.constants";
import type { AllReports } from "../types/reports.types"
import { CurrentMonthReportCard } from "./current-month-report-card";
import PreviousMonthsReportCard from "./previous-months-report-card";

interface ReportsListProps {
    reports: AllReports
    isLoading: boolean
}


export function ReportsList({reports, isLoading}: ReportsListProps) {

     if (isLoading) {
       return (
         <div className="flex flex-col gap-4 w-full animate-pulse">
           {/* Skeleton loading cards */}
           {[1, 2, 3].map((i) => (
             <div key={i} className="h-32 bg-gray-200 rounded-3xl w-full"></div>
           ))}
         </div>
       );
     }
   
     if (!reports) {
       return (
         <div className="text-center py-8 text-text-secondary bg-white rounded-3xl border border-dashed border-gray-200">
           {REPORTS_CONSTANTS.empty}
         </div>
       );
     }

    return  <div className="flex flex-col gap-4 w-full">
        <CurrentMonthReportCard data={reports.currentMonth} />
        <PreviousMonthsReportCard data={reports.previousMonths} />
    </div>
}