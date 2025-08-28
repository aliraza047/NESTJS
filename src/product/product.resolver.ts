import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './dto/product.model';
import { CreateProductInput } from './dto/create-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => Product, { nullable: true })
  async getProduct(@Args('id') id: string): Promise<any> {
    return this.productService.getProduct({ id });
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<any> {
    console.log('createProductInput', createProductInput);
    return this.productService.createProduct(createProductInput);
  }
}
