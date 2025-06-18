
export interface ISubCategory {
    id: number;
    name: string;
    categoryId: number;
}

export interface ICategory {
    id: number;
    name: string;
    subCategories?: ISubCategory[];
}

export interface ICategoryState {
    categories: ICategory[],
    errors: null
}