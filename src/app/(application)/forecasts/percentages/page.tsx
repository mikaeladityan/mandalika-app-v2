import { QueryClient } from "@tanstack/react-query";
import { forecastPercentageService } from "./server/percentages.service";
import { ForecastPercentages } from "@/components/pages/forecast/percentages/index";

export default async function ForecastPercentagesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["forecast-percentages"],
        queryFn: () => forecastPercentageService.getList(),
    });

    return <ForecastPercentages />;
}
