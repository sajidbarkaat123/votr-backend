import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShareHolderService } from './share-holder.service';
import { CreateShareHolderDto } from './dto/create-share-holder.dto';
import { UpdateShareHolderDto } from './dto/update-share-holder.dto';
import { TargetShareHolderService } from './target-share-holder.service';
import { GetShareHolderDto } from './dto/get-share-holders.dto';
import { CreateTargetShareHolderDto } from './dto/create-target-share-holder.dto';

@Controller('share-holder')
export class ShareHolderController {
  constructor(
    private readonly shareHolderService: ShareHolderService,
    private readonly targetShareHolderService: TargetShareHolderService
  ) { }

  @Post()
  create(@Body() createShareHolderDto: CreateShareHolderDto) {
    return this.shareHolderService.create(createShareHolderDto);
  }

  @Post('/target-share-holder')
  createTargetShareHolder(@Body() createTargetShareHolderDto: CreateTargetShareHolderDto) {
    return this.targetShareHolderService.create(createTargetShareHolderDto);
  }

  @Get()
  findAll(@Query() queryFilters: GetShareHolderDto) {
    return this.shareHolderService.findAll(queryFilters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareHolderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShareHolderDto: UpdateShareHolderDto) {
    return this.shareHolderService.update(id, updateShareHolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shareHolderService.remove(id);
  }
}
