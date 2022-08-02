import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>
  ) {}

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto)
    return coffee.save()
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec()
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeeModel
      .findByIdAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec()

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee
  }

  async remove(id: string) {
    const coffee = await this.findOne(id)
    return coffee.remove()
  }

  // exemplo de transaction no mongodb
  async recommendCoffe(coffe: Coffee) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      coffe.recommendations++

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffe',
        type: 'coffe',
        payload: {
          coffeeId: coffe.id
        }
      })
      await recommendEvent.save()
      await coffe.save()

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
    } finally {
      session.endSession()
    }
  }
}
