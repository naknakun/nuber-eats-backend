import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  async CreateRestaurant(data: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(data);
    return await this.restaurantRepository.save(newRestaurant);
  }
}
