# Broker Dashboard API Documentation

## Overview

This document explains the implementation of the Broker Dashboard API, which provides metrics for the dashboard cards shown in the UI. The API leverages the updated `Shares` model that now uses a `price` field instead of `sharesCount`, with the share count being determined by counting records.

## API Endpoints

Each dashboard metric now has its own dedicated endpoint to provide more flexibility and better separation of concerns.

### Get All Dashboard Metrics

```
GET /broker/dashboard/metrics
```

This endpoint returns all metrics for the broker dashboard in a single response.

### Get Total Shares Owned

```
GET /broker/dashboard/metrics/total-shares
```

This endpoint returns the total number of shares owned with change from previous month.

### Get Total Shareholders

```
GET /broker/dashboard/metrics/total-shareholders
```

This endpoint returns the total number of shareholders with change from previous month.

### Get Average Share Price

```
GET /broker/dashboard/metrics/avg-share-price
```

This endpoint returns the average share price with change from previous month.

### Get Alternate Average Share Price

```
GET /broker/dashboard/metrics/avg-share-price-alt
```

This endpoint returns the average share price with shareholders change from previous month (for the fourth card in the UI).

## Response Format

Each endpoint returns a metric in the following format:

```json
{
  "value": "3.48B",
  "rawValue": 3480000000,
  "change": "3.9K",
  "rawChange": 3900,
  "increaseType": "increase"
}
```

The combined endpoint (`/broker/dashboard/metrics`) returns all metrics together:

```json
{
  "totalSharesOwned": {
    "value": "3.48B",
    "rawValue": 3480000000,
    "change": "3.9K",
    "rawChange": 3900,
    "increaseType": "increase"
  },
  "totalShareholders": {
    "value": "394.6K",
    "rawValue": 394600,
    "change": "603",
    "rawChange": 603,
    "increaseType": "increase"
  },
  "avgSharePrice": {
    "value": "$903.3K",
    "rawValue": 903300,
    "change": "$3.2K",
    "rawChange": 3200,
    "increaseType": "increase"
  },
  "avgSharePriceRepeat": {
    "value": "$903.3K",
    "rawValue": 903300,
    "change": "603",
    "rawChange": 603,
    "increaseType": "increase"
  }
}
```

## Implementation Details

### Calculation Logic

- **Total Shares Owned**: Counts the total number of share records in the database
- **Total Shareholders**: Counts the number of unique shareholders
- **Average Share Price**: Calculates the average of the price field across all share records
- **Change Calculation**: Compares current values with values from one month ago

### Formatting

The API applies formatting to make the values more readable in the UI:
- Large numbers are formatted with K, M, or B suffixes (e.g., 3.48B for 3.48 billion)
- Currency values are formatted with a dollar sign and appropriate suffix (e.g., $903.3K)
- Changes are formatted with the same logic

### Integration with Updated Shares Model

The dashboard metrics API demonstrates how the system now uses record counting instead of summing sharesCount values, while maintaining the same response format and structure for frontend integration.

## Frontend Integration

To integrate these APIs with the dashboard cards shown in the UI, you have two options:

### Option 1: Using Separate Endpoints

Make individual requests to each endpoint for each card:

```javascript
import axios from 'axios';
import { useState, useEffect } from 'react';

function BrokerDashboard() {
  const [metrics, setMetrics] = useState({
    totalSharesOwned: null,
    totalShareholders: null,
    avgSharePrice: null,
    avgSharePriceRepeat: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        setLoading(true);
        
        // Fetch all metrics in parallel
        const [
          totalSharesResponse,
          totalShareholdersResponse,
          avgSharePriceResponse,
          avgSharePriceAltResponse
        ] = await Promise.all([
          axios.get('/api/broker/dashboard/metrics/total-shares'),
          axios.get('/api/broker/dashboard/metrics/total-shareholders'),
          axios.get('/api/broker/dashboard/metrics/avg-share-price'),
          axios.get('/api/broker/dashboard/metrics/avg-share-price-alt')
        ]);
        
        setMetrics({
          totalSharesOwned: totalSharesResponse.data,
          totalShareholders: totalShareholdersResponse.data,
          avgSharePrice: avgSharePriceResponse.data,
          avgSharePriceRepeat: avgSharePriceAltResponse.data
        });
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-cards">
      {metrics.totalSharesOwned && (
        <DashboardCard
          icon="dollar"
          title="Total Shares Owned"
          value={metrics.totalSharesOwned.value}
          change={metrics.totalSharesOwned.change}
          increaseType={metrics.totalSharesOwned.increaseType}
        />
      )}
      
      {metrics.totalShareholders && (
        <DashboardCard
          icon="users"
          title="Total Shareholders"
          value={metrics.totalShareholders.value}
          change={metrics.totalShareholders.change}
          increaseType={metrics.totalShareholders.increaseType}
        />
      )}
      
      {metrics.avgSharePrice && (
        <DashboardCard
          icon="chart-line"
          title="Avg. Share Price"
          value={metrics.avgSharePrice.value}
          change={metrics.avgSharePrice.change}
          increaseType={metrics.avgSharePrice.increaseType}
        />
      )}
      
      {metrics.avgSharePriceRepeat && (
        <DashboardCard
          icon="chart-line"
          title="Avg. Share Price"
          value={metrics.avgSharePriceRepeat.value}
          change={metrics.avgSharePriceRepeat.change}
          increaseType={metrics.avgSharePriceRepeat.increaseType}
        />
      )}
    </div>
  );
}
```

### Option 2: Using Combined Endpoint

Make a single request to get all metrics at once:

```javascript
import axios from 'axios';
import { useState, useEffect } from 'react';

function BrokerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        setLoading(true);
        const response = await axios.get('/api/broker/dashboard/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!metrics) return <div>No data available</div>;

  return (
    <div className="dashboard-cards">
      <DashboardCard
        icon="dollar"
        title="Total Shares Owned"
        value={metrics.totalSharesOwned.value}
        change={metrics.totalSharesOwned.change}
        increaseType={metrics.totalSharesOwned.increaseType}
      />
      <DashboardCard
        icon="users"
        title="Total Shareholders"
        value={metrics.totalShareholders.value}
        change={metrics.totalShareholders.change}
        increaseType={metrics.totalShareholders.increaseType}
      />
      <DashboardCard
        icon="chart-line"
        title="Avg. Share Price"
        value={metrics.avgSharePrice.value}
        change={metrics.avgSharePrice.change}
        increaseType={metrics.avgSharePrice.increaseType}
      />
      <DashboardCard
        icon="chart-line"
        title="Avg. Share Price"
        value={metrics.avgSharePriceRepeat.value}
        change={metrics.avgSharePriceRepeat.change}
        increaseType={metrics.avgSharePriceRepeat.increaseType}
      />
    </div>
  );
}

function DashboardCard({ icon, title, value, change, increaseType }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{/* Render icon based on 'icon' prop */}</div>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <div className={`card-change ${increaseType}`}>
        {increaseType === 'increase' ? '↑' : '↓'} {change} from last month
      </div>
    </div>
  );
}
```

## Benefits of Separate Endpoints

Having separate endpoints for each metric provides several benefits:

1. **Independent Loading**: Each card can load and display its data independently
2. **Reduced Bandwidth**: Only fetch the specific metrics needed for a particular view
3. **Targeted Refresh**: Update specific metrics when needed rather than refreshing all data
4. **Better Error Handling**: Handle failures for individual metrics without affecting others
5. **Improved Caching**: Cache individual metrics separately based on their usage patterns 