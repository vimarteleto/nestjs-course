import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Pagination } from 'src/common/functions/pagination';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_BRANDS_TWO } from './coffees.constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(Pagination) private readonly pagination: Pagination,

    // exemplos de injeção de dependencias
    @Inject(COFFEE_BRANDS) coffeeBrands: string[], // injetando dependencias de outras formas
    @Inject(COFFEE_BRANDS_TWO) coffeeBrandsTwo: string[] // injetando dependencias de outras formas
  ) {}

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto)
    return coffee.save()
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery
    // return this.coffeeModel.find().skip(offset).limit(limit).exec();
    const data = await this.coffeeModel.find().skip(offset).limit(limit).exec();
    const total = await this.coffeeModel.count().exec()

    const pagination = this.pagination.getPagination(total, offset, limit)

    return {
      data,
      pagination

    }

    // para retorno com dados de paginação:
    // const data = await this.coffeeModel.find().skip(offset).limit(limit).exec();
    // const total = await this.coffeeModel.count().exec()
    // return {
    //   data,
    //   pagination: {
    //     total,
    //     offset: offset || 0,
    //     limit,
    //   }
    // }
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
