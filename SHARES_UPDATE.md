# Shares Data Model Update

## Overview

The `Shares` data model has been updated to replace the `sharesCount` field with a `price` field. This document explains the changes made and how API responses have been preserved.

## Changes Made

1. **Schema Update**:
   - Removed `sharesCount` field from the `Shares` model
   - Added `price` field to the `Shares` model

2. **Data Model Logic**:
   - Previously, each record in the `Shares` table had a `sharesCount` field that indicated how many shares a shareholder owned through a specific broker
   - Now, each record in the `Shares` table represents a single share with a price, and the count of shares is determined by counting records

3. **Counting Logic Update**:
   - Previously: `totalShares = sum(sharesCount)` for all relevant records
   - Now: `totalShares = count(records)` for all relevant records

## Preserved API Responses

All API responses have been preserved to maintain backward compatibility while implementing the new counting logic:

### Broker Service

- The `sharesCount` field in the response still exists, but now it's calculated by counting the number of share records instead of summing the `sharesCount` field.
- The `sharesRecords` field continues to represent the count of share records.

### Share Holder Service

- The stock ownership filtering (by `stockMinLimit` and `stockMaxLimit`) now uses record counts instead of the sum of `sharesCount`.
- The response structure remains the same, with shareholding limits being applied based on record counts.

### Campaign Analytics Service

- All analytics responses (shares distribution, shareholder demographics, etc.) maintain the same structure.
- The calculation of share counts is now based on counting records rather than summing the `sharesCount` field.
- Share concentration levels continue to be calculated and reported in the same format.

## Implementation Notes

- When implementing the share counting logic, we ensure that for each case where `sharesCount` was previously used, we now count records instead.
- The responses from all APIs maintain the same structure and field names, only the internal calculation method has changed.
- This approach ensures that existing frontend code and API clients will continue to work without modifications.

## Migration Process

1. Update the Prisma schema to change the `Shares` model
2. Modify service implementations to use the new counting logic
3. Update the seed script to use the new `price` field
4. Generate a new Prisma client
5. Push the schema changes to the database
6. Re-seed the database with updated data 