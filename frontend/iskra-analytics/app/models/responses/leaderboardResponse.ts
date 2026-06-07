export interface LeaderboardResponse {
    rank: number;
    studentId: string;
    studentName: string;
    score: number;
    createdAt: string;
    lastScore: number;
    lastCreatedAt: string;
    unit: string;
    isSelectedChild: boolean;
}