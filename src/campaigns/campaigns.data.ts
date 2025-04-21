import { ICampaign, ICampaignDetails } from "src/common/types";

export const allCampaigns: ICampaign[] = [
  {
    _id: "1",
    campaignName: "Campaign name goes here",
    status: "Active",
    startDate: "30 December 2024",
    endDate: "Unspecified",
    category: "Corporate Venture, Shares over 1M",
    brokersIncluded: 476,
    preOrder: false
  },
  {
    _id: "2",
    campaignName: "RoboTaxi 10% Discount",
    status: "Running",
    startDate: "30 October 2024",
    endDate: "Unspecified",
    category: "Corporate Venture, Shares over 1M",
    brokersIncluded: 726,
    preOrder: true
  },
  {
    _id: "3",
    campaignName: "Summer Sale Event",
    status: "Upcoming",
    startDate: "30 December 2024",
    endDate: "February 2025",
    category: "Retail Discounts, Clearance Sales",
    brokersIncluded: 152,
    preOrder: false
  },
  {
    _id: "4",
    campaignName: "Holiday Marketing Campaign",
    status: "Upcoming",
    startDate: "30 December 2024",
    endDate: "February 2025",
    category: "Multi-channel Advertisements, Seasonal Promotions",
    brokersIncluded: 572,
    preOrder: false
  },
  {
    _id: "5",
    campaignName: "Product Launch Blitz",
    status: "Finished",
    startDate: "30 December 2024",
    endDate: "February 2025",
    category: "Digital Marketing, Influencer Collaborations",
    brokersIncluded: 210,
    preOrder: false
  }
];

export const campaignDetails: ICampaignDetails = {
  _id: "2",
  campaignInfo: {
    campaignName: "Tesla x RoboTaxi 10% Discount",
    campaignType: "Early Access Campaign",
    campaignOwner: "Josh R",
    campaignBudget: "$20,000",
    campaignGoals: "Goals go here",
    description:
      "Adipisicing exercitation anim occaecat ad. Pariatur dolor eiusmod do ad commodo. Magna consequat in quis id aliqua. Officia nulla exercitation cillum anim et eu proident voluptate duis laborum duis cupidatat.",
    campaignNotes:
      "Adipisicing exercitation anim occaecat ad. Pariatur dolor eiusmod do ad commodo. Magna consequat in quis id aliqua.",
    preOrder: true
  },
  targetShareholders: {
    region: [
      "California",
      "Texas",
      "New York",
      "Florida",
      "Illinois",
      "Pennsylvania",
      "Ohio",
      "Georgia",
      "Washington"
    ],
    age: "From 18 to 40",
    gender: ["Male", "Female"],
    income: "$10,000 — $40,000 Yearly",
    stockOwnershipStake: "In between 1M — 10M"
  },
  campaignSettings: [
    {
      redeemMethod: "In Store Authorization",
      redeemNotes:
        "Laboris ex excepteur aute cillum aliqua aliquip dolor laboris laboris."
    },
    {
      redeemMethod: "In Store Authorization",
      redeemNotes:
        "Laboris ex excepteur aute cillum aliqua aliquip dolor laboris laboris."
    }
  ],
  discountedProductServiceInfo: {
    productImage: "/product-image.png",
    productName: "Tesla RoboTaxi",
    maximumPasses: 100000,
    discountPercentage: "10%",
    totalRedeemLimit: 50000,
    productLink: "https://govotr.com/campaign-campaing-robotaxi-2025",
    description:
      "The Tesla Robotaxi is a fully autonomous electric vehicle designed to revolutionize urban transportation. Equipped with Tesla's advanced Full Self-Driving (FSD) software and powered by clean electric energy, the Robotaxi provides a seamless, driverless ride-hailing experience. With zero emissions and cutting-edge AI, it offers a sustainable, cost-effective."
  }
};