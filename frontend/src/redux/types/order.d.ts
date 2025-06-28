export interface IOrder {
    id: number;
    userId: number;
    orderNumber: string;
    subTotal: number;
    tax: number;
    shipping: number;
    orderTotal: number;
    stripePaymentIntentId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    status: string;
    createdAt: string;
}

export interface IOrderPreview{
    id: number;
    orderNumber: string;
    orderTotal: number;
    status: string;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    items: {
        itemId: number;
        name: string;
        mainImageUrl: string;
        price: number;
        quantity: number;
    }[];
};

export interface IOrderState {
    orders: IOrder[];
    order: IOrder | null;
    orderPreview: IOrderPreview | null;
    isLoading: boolean;
    errors: string | null;
};