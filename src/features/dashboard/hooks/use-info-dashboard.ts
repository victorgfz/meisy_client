import { useCallback, useEffect, useState } from "react";
import type { InfoDashboard } from "../types/dashboard.types";
import { reportsService } from "../services/reports.service";

export function useInfoDashboard() {
    const [infoDashboard, setInfoDashboard] = useState<InfoDashboard>();
    const [isLoading, setIsLoading] = useState(false);


    const fetchInfoDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await reportsService.getInfoDashboard();
            setInfoDashboard(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInfoDashboard();

        const handleRefresh = () => {
            fetchInfoDashboard();
        };

        window.addEventListener('dashboard-needs-refresh', handleRefresh);

        return () => {
            window.removeEventListener('dashboard-needs-refresh', handleRefresh);
        };
    }, [fetchInfoDashboard]);


    return {
        infoDashboard,
        isLoading,
        fetchInfoDashboard
    }
}