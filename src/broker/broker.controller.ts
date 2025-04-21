import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBrokerDto } from './dto/get-broker.dto';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import { MetricDto } from './dto/metric.dto';

@ApiTags('Brokers')
@Controller('broker')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new broker' })
  @ApiResponse({ status: 201, description: 'The broker has been successfully created.' })
  create(@Body() createBrokerDto: CreateBrokerDto) {
    return this.brokerService.create(createBrokerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all brokers with pagination and search',
    description: 'Returns brokers with additional information: shares count, shareholders count, active campaigns, and total campaigns. Can filter by name and email using the search parameter.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of brokers with pagination metadata and enhanced information'
  })
  findAll(@Query() getBrokerDto: GetBrokerDto) {
    return this.brokerService.findAll(getBrokerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a broker by ID' })
  @ApiResponse({ status: 200, description: 'Returns the broker with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Broker not found.' })
  findOne(@Param('id') id: string) {
    return this.brokerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a broker' })
  @ApiResponse({ status: 200, description: 'The broker has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateBrokerDto: UpdateBrokerDto) {
    return this.brokerService.update(id, updateBrokerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a broker' })
  @ApiResponse({ status: 200, description: 'The broker has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.brokerService.remove(id);
  }

  @Get('dashboard/metrics')
  @ApiOperation({ 
    summary: 'Get all broker dashboard metrics',
    description: 'Returns all metrics for broker dashboard including total shares owned, total shareholders, and average share price with changes from previous month.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All dashboard metrics successfully retrieved',
    type: DashboardMetricsDto
  })
  getDashboardMetrics(): Promise<DashboardMetricsDto> {
    return this.brokerService.getDashboardMetrics();
  }

  @Get('dashboard/metrics/total-shares')
  @ApiOperation({ 
    summary: 'Get total shares owned metric',
    description: 'Returns the total number of shares owned with change from previous month.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Total shares owned metric successfully retrieved',
    type: MetricDto
  })
  getTotalSharesOwned(): Promise<MetricDto> {
    return this.brokerService.getTotalSharesOwned();
  }

  @Get('dashboard/metrics/total-shareholders')
  @ApiOperation({ 
    summary: 'Get total shareholders metric',
    description: 'Returns the total number of shareholders with change from previous month.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Total shareholders metric successfully retrieved',
    type: MetricDto
  })
  getTotalShareholders(): Promise<MetricDto> {
    return this.brokerService.getTotalShareholders();
  }

  @Get('dashboard/metrics/avg-share-price')
  @ApiOperation({ 
    summary: 'Get average share price metric',
    description: 'Returns the average share price with change from previous month.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Average share price metric successfully retrieved',
    type: MetricDto
  })
  getAvgSharePrice(): Promise<MetricDto> {
    return this.brokerService.getAvgSharePrice();
  }

  @Get('dashboard/metrics/avg-share-price-alt')
  @ApiOperation({ 
    summary: 'Get alternate average share price metric',
    description: 'Returns the average share price with shareholder change from previous month (for the fourth card).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Alternate average share price metric successfully retrieved',
    type: MetricDto
  })
  getAvgSharePriceRepeat(): Promise<MetricDto> {
    return this.brokerService.getAvgSharePriceRepeat();
  }
}
