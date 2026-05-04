export interface RecommendationResponse{
    name: string;
    description: string | undefined;
    recommendation: string | undefined;
    unit: string;
}