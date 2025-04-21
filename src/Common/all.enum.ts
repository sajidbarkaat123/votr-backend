export enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
}

export enum StockStatus {
  Available = 'Available',
  Sold = 'Sold',
  Reserved = 'Reserved',
}

export enum CarCondition {
  New = 'New',
  Used = 'Used',
  CertifiedPreOwned = 'CertifiedPreOwned',
}

export enum Transmission {
  Manual = 'Manual',
  Automatic = 'Automatic',
  CVT = 'CVT',
}


export enum CampaignType {
  DISCOUNTED_PRODUCTS = "DISCOUNTED_PRODUCTS",
  EARLY_ACCESS_TO_PRODUCTS = "EARLY_ACCESS_TO_PRODUCTS",
  EARLY_ACCESS_TO_EVENTS = "EARLY_ACCESS_TO_EVENTS",
  EXCLUSIVE_EVENTS = "EXCLUSIVE_EVENTS",
}

export enum CampaignStatus {
  Active = "Active",
  RUNNING = "RUNNING",
  UPCOMING = "UPCOMING",
  FINISHED = "FINISHED"
}
export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  ALL="ALL"
}


export enum DeliveryMethodType {
  EMAIL = 'EMAIL',
  IN_APP_NOTIFICATION = 'IN_APP_NOTIFICATION',
  MOBILE_APP_MARKET_PLACE = 'MOBILE_APP_MARKET_PLACE',
  WEB_APP_MARKET_PLACE = 'WEB_APP_MARKET_PLACE',
}


export enum rangeType{
  AGE= 'AGE',
    INCOME= 'INCOME',
    STOCK_OWNERSHIP= 'STOCK_OWNERSHIP',
}

export enum ShareholderConcentrationLevel {
  HIGH = '1M+',
  MEDIUM = '500K - 900K',
  LOW = '<500K'
}

export enum AgeGroupFilter {
  ALL = 'all',
  AGE_18_24 = '18-24',
  AGE_25_34 = '25-34',
  AGE_35_44 = '35-44', 
  AGE_45_54 = '45-54',
  AGE_55_65 = '55-65',
  AGE_65_PLUS = '65+'
}