export interface IReview {
    id?: number;
    userId: number;
    itemId: number;
    stars: number;
    reviewBody: string;
    createdAt: string;
    user?: {
        username: string;
    };
}

export interface IExistingReview extends IReview{
    id: number;
    user: {
        username: string;
    };
}

export interface IReviewState {
    reviewsByItem: {
        [itemId: number]: IReview[];
    }
    errors: string | null;
}