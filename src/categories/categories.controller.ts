import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern({ cmd: 'create_category' })
  // @Post()
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern({ cmd: 'find_all_categories' })
  // @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @MessagePattern({ cmd: 'find_category_by_id' })
  // @Get(':id')
  findOne(@Payload('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update_category' })
  // @Patch(':id')
  update(@Payload() updateCategpryDto: UpdateCategoryDto,) {
    return this.categoriesService.update(updateCategpryDto.id, updateCategpryDto);
   
    
  }

  @MessagePattern({ cmd: 'remove_category' })
  // @Delete(':id')
  remove(@Payload('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
