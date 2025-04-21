import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'The new status for the invoice',
    enum: ['PENDING', 'PAID', 'CANCELLED', 'OVERDUE', 'DUE'],
    example: 'PAID',
  })
  status: string;
}

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Return all invoices.' })
  findAll(@Query() filter: FilterInvoiceDto) {
    return this.invoiceService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Return invoice by ID.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get invoice by campaign ID' })
  @ApiResponse({ status: 200, description: 'Return invoice by campaign ID.' })
  @ApiResponse({ status: 404, description: 'Invoice not found for this campaign.' })
  findByCampaignId(@Param('campaignId') campaignId: string) {
    return this.invoiceService.findByCampaignId(campaignId);
  }

  @Get('billing-card/:invoiceId')
  @ApiOperation({ summary: 'Get billing card data for an invoice' })
  @ApiResponse({ status: 200, description: 'Return billing card data.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  getBillingCard(@Param('invoiceId') invoiceId: string) {
    return this.invoiceService.getBillingCardData(invoiceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiResponse({ status: 200, description: 'Invoice status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid status.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  @ApiBody({ type: UpdateStatusDto })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.invoiceService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
} 