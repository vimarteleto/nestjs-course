import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  // database
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Café Regina',
      brand: 'Starbucks',
      flavors: ['chocolate', 'baunilha'],
    }
  ]

  create(createCoffeeDto: CreateCoffeeDto) {
    this.coffees.push(createCoffeeDto)
    return createCoffeeDto
  }

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee =  this.coffees.find(item => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = this.findOne(id)
    if (existingCoffee) {
      return 'TODO'
      // TODO
    }
  }

  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex(item => item.id === +id)

    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1)
    }

  }
}
