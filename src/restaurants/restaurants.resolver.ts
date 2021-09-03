import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    console.log('veganOnly', veganOnly);

    return [];
  }

  @Mutation(() => Boolean)
  createRestaurant(@Args() createRestaurant: CreateRestaurantDto): boolean {
    console.log(createRestaurant);

    return true;
  }
}
