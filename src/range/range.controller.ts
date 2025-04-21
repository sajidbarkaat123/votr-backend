import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RangeService } from './range.service';
import { CreateRangeDto } from './dto/create-range.dto';
import { UpdateRangeDto } from './dto/update-range.dto';

@Controller('range')
export class RangeController {
  constructor(private readonly rangeService: RangeService) {}

  @Post()
  create(@Body() createRangeDto: CreateRangeDto) {
    return this.rangeService.create(createRangeDto);
  }

  @Get()
  findAll() {
    return this.rangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rangeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRangeDto: UpdateRangeDto) {
    return this.rangeService.update(+id, updateRangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rangeService.remove(+id);
  }
}
