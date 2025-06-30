import { IReview } from './review';


export interface IFullItem {
    id: number;
    name: string;
    price: number | string;
    description: string;
    mainImageUrl: string;
    image2Url?: string;
    image3Url?: string;
    image4Url?: string;
    image5Url?: string;
    categoryId: number;
    subcategoryId: number;
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
    price: number | string;
    mainImageUrl: string;
    avgRating?: number
    reviewCount?: number;
    categoryId: number;
    subCategoryId: number;
}



export interface IItemWithReviews extends IFullItem {
    reviews: IReview[];
    stars: number;
    reviewCount: number;
}