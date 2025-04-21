import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clean up existing data (optional - be careful in production)
  await cleanupData();

  // 1. Create Roles first
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN'
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER'
    }
  });

  console.log(`Created roles: ${adminRole.name}, ${userRole.name}`);

  // 2. Create Users with associated roles
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id
    }
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      roleId: userRole.id
    }
  });

  console.log(`Created users: ${adminUser.email}, ${regularUser.email}`);

  // 3. Create Companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'Tech Innovations Inc.',
        email: 'contact@techinnovations.com',
        country: 'USA'
      }
    }),
    prisma.company.create({
      data: {
        name: 'Green Energy Solutions',
        email: 'info@greenenergy.com',
        country: 'Germany'
      }
    }),
    prisma.company.create({
      data: {
        name: 'Future Finance Group',
        email: 'support@futurefinance.com',
        country: 'UK'
      }
    })
  ]);

  console.log(`Created ${companies.length} companies`);

  // 4. Create Brookers
  const brookers = await Promise.all([
    prisma.brooker.create({
      data: {
        name: 'John Broker',
        email: 'john@brokers.com',
        country: 'USA',
        age: 42,
        status: 'active'
      }
    }),
    prisma.brooker.create({
      data: {
        name: 'Maria Investments',
        email: 'maria@investments.com',
        country: 'Spain',
        age: 35,
        status: 'active'
      }
    }),
    prisma.brooker.create({
      data: {
        name: 'Zhang Financial',
        email: 'zhang@financial.com',
        country: 'China',
        age: 45,
        status: 'active'
      }
    })
  ]);

  console.log(`Created ${brookers.length} brookers`);

  // 5. Create ShareHolders
  const shareHolders = await Promise.all([
    prisma.shareHolder.create({
      data: {
        name: 'Alice Investor',
        email: 'alice@example.com',
        country: 'USA',
        region: 'North America',
        age: 35,
        gender: 'FEMALE',
        income: 85000
      }
    }),
    prisma.shareHolder.create({
      data: {
        name: 'Bob Capital',
        email: 'bob@example.com',
        country: 'Canada',
        region: 'North America',
        age: 42,
        gender: 'MALE',
        income: 110000
      }
    }),
    prisma.shareHolder.create({
      data: {
        name: 'Carla Wealth',
        email: 'carla@example.com',
        country: 'UK',
        region: 'Europe',
        age: 28,
        gender: 'FEMALE',
        income: 75000
      }
    }),
    prisma.shareHolder.create({
      data: {
        name: 'David Money',
        email: 'david@example.com',
        country: 'Australia',
        region: 'Oceania',
        age: 50,
        gender: 'MALE',
        income: 120000
      }
    }),
    prisma.shareHolder.create({
      data: {
        name: 'Eva Stocks',
        email: 'eva@example.com',
        country: 'Germany',
        region: 'Europe',
        age: 33,
        gender: 'FEMALE',
        income: 90000
      }
    })
  ]);

  console.log(`Created ${shareHolders.length} shareholders`);

  // 6. Create Shares relationships between Companies, Brookers, and ShareHolders
  const sharesData = [
    // Alice owns shares in Tech Innovations through John Broker
    {
      companyId: companies[0].id,
      brookerId: brookers[0].id,
      shareHolderId: shareHolders[0].id,
      price: 150
    },
    // Bob owns shares in Green Energy through Maria
    {
      companyId: companies[1].id,
      brookerId: brookers[1].id,
      shareHolderId: shareHolders[1].id,
      price: 200
    },
    // Carla owns shares in Future Finance through Zhang
    {
      companyId: companies[2].id,
      brookerId: brookers[2].id,
      shareHolderId: shareHolders[2].id,
      price: 100
    },
    // David owns shares in Tech Innovations through Maria
    {
      companyId: companies[0].id,
      brookerId: brookers[1].id,
      shareHolderId: shareHolders[3].id,
      price: 175
    },
    // Eva owns shares in Green Energy through John
    {
      companyId: companies[1].id,
      brookerId: brookers[0].id,
      shareHolderId: shareHolders[4].id,
      price: 125
    },
    // Alice also owns shares in Future Finance through Zhang
    {
      companyId: companies[2].id,
      brookerId: brookers[2].id,
      shareHolderId: shareHolders[0].id,
      price: 75
    },
    // Bob also owns shares in Tech Innovations through John
    {
      companyId: companies[0].id,
      brookerId: brookers[0].id,
      shareHolderId: shareHolders[1].id,
      price: 90
    }
  ];

  const shares = await Promise.all(
    sharesData.map(shareData => 
      prisma.shares.create({
        data: shareData
      })
    )
  );

  console.log(`Created ${shares.length} share records`);

  // 7. Create Campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        title: 'Summer Stock Promotion',
        description: 'Special summer offers for our valued stockholders',
        campaignBudget: 50000,
        campaignDetails: { promotionCode: 'SUMMER2023', discount: '15%' },
        campaignGoals: 'Increase stockholder engagement by 25%',
        campaignOwner: 'Marketing Department',
        notes: 'Focus on tech sector shareholders',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-08-31'),
        endAutomatically: true,
        status: 'Active',
        category: 'PROMOTION',
        campaignAccess: 'ALL_SHAREHOLDERS',
        removeCampaignAccess: 'MANUAL',
        redeemMethod: 'ONLINE_CODE',
        campaignType: 'DISCOUNTED_PRODUCTS',
        shareHolders: {
          connect: [
            { id: shareHolders[0].id },
            { id: shareHolders[1].id },
            { id: shareHolders[2].id }
          ]
        }
      }
    }),
    prisma.campaign.create({
      data: {
        title: 'Exclusive Investor Event',
        description: 'VIP access to our annual investor conference',
        campaignBudget: 75000,
        campaignDetails: { eventDate: '2023-10-15', location: 'New York' },
        campaignGoals: 'Generate investment leads and strengthen relationships',
        campaignOwner: 'Investor Relations',
        notes: 'High-value shareholders only',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-10-15'),
        endAutomatically: false,
        status: 'Active',
        category: 'EVENT',
        campaignAccess: 'SELECTED_SHAREHOLDERS',
        removeCampaignAccess: 'AUTOMATIC',
        redeemMethod: 'QR_CODE',
        campaignType: 'EXCLUSIVE_EVENTS',
        shareHolders: {
          connect: [
            { id: shareHolders[3].id },
            { id: shareHolders[4].id }
          ]
        }
      }
    })
  ]);

  console.log(`Created ${campaigns.length} campaigns`);
  console.log('Campaign IDs for testing:');
  console.log(`- Campaign 1 (${campaigns[0].title}): ${campaigns[0].id}`);
  console.log(`- Campaign 2 (${campaigns[1].title}): ${campaigns[1].id}`);

  // Create Invoices for the campaigns
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        notificationCost: 1250.50,
        micillenousCost: 750.25,
        audienceCost: 3500.00,
        reachCost: 1200.75,
        taxRate: 0.05,
        campaignTransactionCost: 250.00,
        bogoDiscount: 100.00,
        status: 'PAID',
        notes: 'Summer promotion campaign invoice',
        campaignId: campaigns[0].id,
        brokerBreakdowns: {
          create: [
            {
              brokerId: brookers[0].id,
              reachCost: 450.25,
              engagementFee: 200.50
            },
            {
              brokerId: brookers[1].id,
              reachCost: 350.50,
              engagementFee: 150.25
            },
            {
              brokerId: brookers[2].id,
              reachCost: 400.00,
              engagementFee: 175.00
            }
          ]
        }
      }
    }),
    prisma.invoice.create({
      data: {
        notificationCost: 2300.75,
        micillenousCost: 950.50,
        audienceCost: 5250.00,
        reachCost: 1850.25,
        taxRate: 0.07,
        campaignTransactionCost: 375.00,
        bogoDiscount: 200.00,
        status: 'PENDING',
        notes: 'VIP investor event invoice',
        campaignId: campaigns[1].id,
        brokerBreakdowns: {
          create: [
            {
              brokerId: brookers[0].id,
              reachCost: 650.75,
              engagementFee: 275.25
            },
            {
              brokerId: brookers[1].id,
              reachCost: 600.50,
              engagementFee: 300.00
            },
            {
              brokerId: brookers[2].id,
              reachCost: 599.00,
              engagementFee: 250.00
            }
          ]
        }
      }
    })
  ]);

  console.log(`Created ${invoices.length} invoices`);
  console.log('Invoice IDs for testing:');
  console.log(`- Invoice 1 (Campaign: ${campaigns[0].title}): ${invoices[0].id}`);
  console.log(`- Invoice 2 (Campaign: ${campaigns[1].title}): ${invoices[1].id}`);

  // 8. Create TargetShareHoldersInfo
  const targetShareHoldersInfo = await Promise.all([
    prisma.targetShareHoldersInfo.create({
      data: {
        region: ['North America', 'Europe'],
        age: '25-55',
        income: '75000-150000',
        minstockOwnerShipStake: 50,
        maxstockOwnerShipStake: 500,
        stockOwninBetween: { min: 50, max: 500 },
        gender: 'ALL',
        campaignId: campaigns[0].id
      }
    }),
    prisma.targetShareHoldersInfo.create({
      data: {
        region: ['North America', 'Europe', 'Asia'],
        age: '35-65',
        income: '100000-250000',
        minstockOwnerShipStake: 100,
        maxstockOwnerShipStake: null,
        stockOwninBetween: { min: 100, max: null },
        gender: 'ALL',
        campaignId: campaigns[1].id
      }
    })
  ]);

  console.log(`Created ${targetShareHoldersInfo.length} target shareholder info records`);

  // 9. Create DeliveryMethod
  const deliveryMethods = await Promise.all([
    prisma.deliveryMethod.create({
      data: {
        maxCount: 1000,
        preferedTime: 'MORNING',
        type: 'EMAIL',
        campaignId: campaigns[0].id
      }
    }),
    prisma.deliveryMethod.create({
      data: {
        maxCount: 500,
        preferedTime: 'AFTERNOON',
        type: 'IN_APP_NOTIFICATION',
        campaignId: campaigns[0].id
      }
    }),
    prisma.deliveryMethod.create({
      data: {
        maxCount: 250,
        preferedTime: 'EVENING',
        type: 'EMAIL',
        campaignId: campaigns[1].id
      }
    })
  ]);

  console.log(`Created ${deliveryMethods.length} delivery methods`);

  // 10. Create CampaignClicks - for analytics
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  // Generate random dates within the specified range
  function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Create campaign clicks (30 for campaign 1, 20 for campaign 2)
  const clicksData = [];
  
  // Recent clicks for campaign 1 (should be included in 30-day analytics)
  for (let i = 0; i < 30; i++) {
    clicksData.push({
      campaignId: campaigns[0].id,
      createdAt: getRandomDate(oneMonthAgo, today)
    });
  }
  
  // Older clicks for campaign 1 (should NOT be included in 30-day analytics)
  for (let i = 0; i < 10; i++) {
    clicksData.push({
      campaignId: campaigns[0].id,
      createdAt: getRandomDate(twoMonthsAgo, oneMonthAgo)
    });
  }
  
  // Clicks for campaign 2
  for (let i = 0; i < 20; i++) {
    clicksData.push({
      campaignId: campaigns[1].id,
      createdAt: getRandomDate(oneMonthAgo, today)
    });
  }

  const campaignClicks = await Promise.all(
    clicksData.map(data => prisma.campaignClicks.create({ data }))
  );

  console.log(`Created ${campaignClicks.length} campaign clicks`);

  // 11. Create CampaignEmails
  const emailsData = [];
  
  // Recent emails for campaign 1
  for (let i = 0; i < 100; i++) {
    emailsData.push({
      campaignId: campaigns[0].id,
      isOpened: Math.random() > 0.3, // 70% open rate
      createdAt: getRandomDate(oneMonthAgo, today)
    });
  }
  
  // Older emails for campaign 1
  for (let i = 0; i < 50; i++) {
    emailsData.push({
      campaignId: campaigns[0].id,
      isOpened: Math.random() > 0.4, // 60% open rate
      createdAt: getRandomDate(twoMonthsAgo, oneMonthAgo)
    });
  }
  
  // Emails for campaign 2
  for (let i = 0; i < 75; i++) {
    emailsData.push({
      campaignId: campaigns[1].id,
      isOpened: Math.random() > 0.35, // 65% open rate
      createdAt: getRandomDate(oneMonthAgo, today)
    });
  }

  const campaignEmails = await Promise.all(
    emailsData.map(data => prisma.campaignEmails.create({ data }))
  );

  console.log(`Created ${campaignEmails.length} campaign emails`);

  // 12. Create CampaignOfferRedeemed
  const offerRedeemedData = [
    // Recent offer redemptions for campaign 1
    ...Array(15).fill(null).map(() => ({
      campaignId: campaigns[0].id,
      shareHolderId: shareHolders[Math.floor(Math.random() * 3)].id, // Random from first 3 shareholders
      createdAt: getRandomDate(oneMonthAgo, today)
    })),
    // Older offer redemptions for campaign 1
    ...Array(5).fill(null).map(() => ({
      campaignId: campaigns[0].id,
      shareHolderId: shareHolders[Math.floor(Math.random() * 3)].id,
      createdAt: getRandomDate(twoMonthsAgo, oneMonthAgo)
    })),
    // Offer redemptions for campaign 2
    ...Array(10).fill(null).map(() => ({
      campaignId: campaigns[1].id,
      shareHolderId: shareHolders[3 + Math.floor(Math.random() * 2)].id, // Random from shareholders 4-5
      createdAt: getRandomDate(oneMonthAgo, today)
    }))
  ];

  const campaignOfferRedeemed = await Promise.all(
    offerRedeemedData.map(data => prisma.campaignOfferRedeemed.create({ data }))
  );

  console.log(`Created ${campaignOfferRedeemed.length} campaign offer redemptions`);

  // 13. Create CampaignRewardClaim
  const rewardClaimData = [
    // Recent reward claims for campaign 1
    ...Array(8).fill(null).map(() => ({
      campaignId: campaigns[0].id,
      brokerId: brookers[Math.floor(Math.random() * brookers.length)].id,
      createdAt: getRandomDate(oneMonthAgo, today)
    })),
    // Older reward claims for campaign 1
    ...Array(3).fill(null).map(() => ({
      campaignId: campaigns[0].id,
      brokerId: brookers[Math.floor(Math.random() * brookers.length)].id,
      createdAt: getRandomDate(twoMonthsAgo, oneMonthAgo)
    })),
    // Reward claims for campaign 2
    ...Array(5).fill(null).map(() => ({
      campaignId: campaigns[1].id,
      brokerId: brookers[Math.floor(Math.random() * brookers.length)].id,
      createdAt: getRandomDate(oneMonthAgo, today)
    }))
  ];

  const campaignRewardClaim = await Promise.all(
    rewardClaimData.map(data => prisma.campaignRewardClaim.create({ data }))
  );

  console.log(`Created ${campaignRewardClaim.length} campaign reward claims`);

  console.log(`Seeding finished.`);
}

// Optional function to clean existing data before seeding
async function cleanupData() {
  console.log('Cleaning up existing data...');
  
  // Delete in reverse order of dependencies
  await prisma.campaignRewardClaim.deleteMany({});
  await prisma.campaignOfferRedeemed.deleteMany({});
  await prisma.campaignEmails.deleteMany({});
  await prisma.campaignClicks.deleteMany({});
  await prisma.deliveryMethod.deleteMany({});
  await prisma.targetShareHoldersInfo.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.shares.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.shareHolder.deleteMany({});
  await prisma.brooker.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  
  console.log('Data cleanup complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 