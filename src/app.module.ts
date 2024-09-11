import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { RentalsModule } from './rentals/rentals.module';

@Module({
  imports: [ CategoriesModule, ProductsModule, RentalsModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
