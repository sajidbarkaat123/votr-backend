import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignEmailDto } from './dto/create-campaign-email.dto';
import { CreateCampaignClickDto } from './dto/create-campaign-click.dto';
import { CreateCampaignOfferRedeemedDto } from './dto/create-campaign-offer-redeemed.dto';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('productImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productImage: {
          type: 'string',
          format: 'binary',
        },
        // Include other properties from CreateCampaignDto here
      },
    },
  })
  create(
    @Req() req: Request,
    @Body() createCampaignDto: CreateCampaignDto,
    @UploadedFile() productImage: any
  ) {
    console.log("this is the request",req.body);
    return this.campaignsService.create(createCampaignDto, productImage);
  }

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }
  
  

  @Patch(':id')
  @UseInterceptors(FileInterceptor('productImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productImage: {
          type: 'string',
          format: 'binary',
        },
        // Include other properties from UpdateCampaignDto here
      },
    },
  })
  update(
    @Param('id') id: string, 
    @Body() updateCampaignDto: UpdateCampaignDto,
    @UploadedFile() productImage: any
  ) {
    return this.campaignsService.update(id, updateCampaignDto, productImage);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(+id);
  }
  
}
