import { IReview } from './review';


export interface IFullItem {
    id: number;
    name: string;
    price: number;
    description: string;
    mainImageUrl: string;
    image2Url?: string;
    image3Url?: string;
    image4Url?: string;
    image5Url?: string;
    categoryId: number;
    subcategoryId: number;
    listId: number;
}

export interface IItemState {
    subCategoryItems: { [id: number]: IItem}
    categoryItems: IItem[];
    currentItem: IItemWithReviews | null;
    errors: string | null
}

export interface IItem {
    id: number;
    name: string;
    price: number;
    mainImageUrl: string;
    avgRating?: number
    reviewCount?: number;
    categoryId: number;
    subCategoryId: number;
}



export interface IItemWithReviews extends IFullItem {
    reviews: IReview[];
    averageRating: number;
    reviewCount: number;
}