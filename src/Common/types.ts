import { DeliveryMethodType } from "./all.enum";

interface IBase extends Record<string, unknown> {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICampaign extends IBase {
    campaignName: string;
    status: ICampaignStatuses;
    startDate: string;
    endDate: string;
    category: string;
    brokersIncluded: number;
    preOrder: boolean;
}

export interface ICampaignDetails extends IBase {
    campaignInfo: {
        campaignName: string;
        campaignType: string;
        campaignOwner: string;
        campaignBudget: string;
        campaignGoals: string;
        description: string;
        campaignNotes: string;
        preOrder: boolean;
    };
    targetShareholders: {
        region: string[];
        age: string;
        gender: string[];
        income: string;
        stockOwnershipStake: string;
    };
    campaignSettings: {
        redeemMethod: string;
        redeemNotes: string;
    }[];
    discountedProductServiceInfo: {
        productImage: string;
        productName: string;
        maximumPasses: number;
        discountPercentage: string;
        totalRedeemLimit: number;
        productLink: string;
        description: string;
    };
}

export type ICampaignStatuses = "Active" | "Running" | "Upcoming" | "Finished";


interface IDiscountedProduct {
    name: string;
    passesCount: string;
    discount: string;
    redeemLimit: string;
    description: string;
    image: string;
    productWebLink: string;
    productAppLink: string;
}

interface IEarlyAccessProduct {
    name: string;
    launchDate: string;
    earlyAccessDate: string;
    description: string;
    productImage: string;
    productWebLink: string;
    productAppLink: string;
}


type ICampaignType = IDiscountedProduct | IEarlyAccessProduct;

export interface ICampaignWhereInput {
    id: string;

}

export interface IDeliveryMethod {
    type: DeliveryMethodType
    maxCount: number;
    preferedTime: string;
    campaignId?: string;
}

export interface IListing<D> {
    data: D[],
    count: number
}