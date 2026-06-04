import { ReportsList } from "../components/reports-list";
import { useReports } from "../hooks/use-reports";

export function ReportsPage() {
    const { reports, isLoading } = useReports();

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto relative pt-6">
            <ReportsList reports={reports!} isLoading={isLoading} />
        </div>
    );
}
