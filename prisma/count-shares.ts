import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countShares() {
  try {
    console.log('Checking database share counts...');

    // Count total share records
    const totalShareRecords = await prisma.shares.count();
    console.log(`Total share RECORDS in database: ${totalShareRecords}`);

    // Share counts are now just the number of records, not a sum of sharesCount
    console.log(`Total QUANTITY of shares in database: ${totalShareRecords}`);
    console.log('\n--- IMPORTANT DISTINCTION ---');
    console.log('Share RECORDS: Number of rows in the Shares table (relationships between shareholders and brokers)');
    console.log('Share QUANTITY: Now the same as Share RECORDS, as we count each record as one share');
    console.log('Share API RESPONSES: All API responses maintain the same structure, but internally use record counts');
    console.log('--------------------------------\n');

    // Get all brokers
    const brokers = await prisma.brooker.findMany({
      select: {
        id: true,
        name: true
      }
    });

    // Get all shareholders with their age info
    const shareholders = await prisma.shareHolder.findMany({
      select: {
        id: true,
        name: true,
        age: true
      }
    });

    console.log('\nAgeGroups of shareholders:');
    shareholders.forEach(sh => {
      console.log(`${sh.name}: Age ${sh.age}`);
    });

    // Get shares data with detailed relations
    const sharesData = await prisma.shares.findMany({
      include: {
        brooker: true,
        shareHolder: true
      }
    });

    console.log('\nDetailed share counts by broker:');
    
    // Group by broker
    const brokerShareCounts = new Map();
    
    sharesData.forEach(share => {
      const brookerId = share.brookerId;
      const brokerName = share.brooker.name;
      const shareholderAge = share.shareHolder.age;
      // Each share record counts as 1
      const sharesCount = 1;
      
      if (!brokerShareCounts.has(brookerId)) {
        brokerShareCounts.set(brookerId, {
          name: brokerName,
          totalShares: 0,
          ageGroups: {
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55-65': 0,
            '65+': 0
          }
        });
      }
      
      const brokerData = brokerShareCounts.get(brookerId);
      brokerData.totalShares += sharesCount;
      
      // Determine age group
      let ageGroup;
      if (shareholderAge >= 18 && shareholderAge <= 24) ageGroup = '18-24';
      else if (shareholderAge >= 25 && shareholderAge <= 34) ageGroup = '25-34';
      else if (shareholderAge >= 35 && shareholderAge <= 44) ageGroup = '35-44';
      else if (shareholderAge >= 45 && shareholderAge <= 54) ageGroup = '45-54';
      else if (shareholderAge >= 55 && shareholderAge <= 65) ageGroup = '55-65';
      else ageGroup = '65+';
      
      brokerData.ageGroups[ageGroup] += sharesCount;
    });
    
    // Output results
    brokerShareCounts.forEach(broker => {
      console.log(`\nBroker: ${broker.name}`);
      console.log(`Total shares QUANTITY: ${broker.totalShares}`);
      console.log('Shares by age group:');
      Object.entries(broker.ageGroups).forEach(([ageGroup, count]) => {
        console.log(`  ${ageGroup}: ${count}`);
      });
    });

    // Get specific campaign data
    console.log('\nCampaign shareholder data:');
    const campaignShareholders = await prisma.campaign.findFirst({
      where: {
        title: 'Summer Stock Promotion'
      },
      include: {
        shareHolders: {
          include: {
            shares: {
              include: {
                brooker: true
              }
            }
          }
        }
      }
    });

    if (campaignShareholders) {
      console.log(`Campaign: ${campaignShareholders.title}`);
      console.log(`Total shareholders in campaign: ${campaignShareholders.shareHolders.length}`);
      
      // Calculate campaign totals
      let campaignTotalShareQuantity = 0;
      let campaignTotalShareRecords = 0;
      
      campaignShareholders.shareHolders.forEach(shareholder => {
        console.log(`\nShareholder: ${shareholder.name}, Age: ${shareholder.age}`);
        console.log(`Share RECORDS: ${shareholder.shares.length}`);
        
        let shareholderTotalShares = 0;
        shareholder.shares.forEach(share => {
          // Each share record counts as 1
          shareholderTotalShares += 1;
          campaignTotalShareQuantity += 1;
          campaignTotalShareRecords++;
          console.log(`  Broker: ${share.brooker.name}, Shares QUANTITY: 1, Price: ${share.price || 'N/A'}`);
        });
        console.log(`  Total share QUANTITY for this shareholder: ${shareholderTotalShares}`);
      });
      
      console.log(`\nTotal share RECORDS in campaign: ${campaignTotalShareRecords}`);
      console.log(`Total share QUANTITY in campaign: ${campaignTotalShareQuantity}`);
    } else {
      console.log('Campaign not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countShares(); 