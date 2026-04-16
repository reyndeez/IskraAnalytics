export interface LeaderboardResponse {
    rank: number;
    studentId: string;
    studentName: string;
    score: number;
    unit: string;
    createdAt: string;
    isSelectedChild: boolean;
}