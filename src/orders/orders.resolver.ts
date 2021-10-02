import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { OrdersResponse } from '../graphql'
import { OrdersFilter } from '../retail_api/types'

@Resolver('Orders')
export class OrdersResolver {
  constructor(private retailService: RetailService) {
  }

  @Query()
  async order(@Args('number') id: string) {
    return this.retailService.findOrder(id)
  }

  @Query()
  async getOrders(@Args() filter: OrdersFilter): Promise<OrdersResponse> {
    return this.retailService.orders(filter)
      .then(([orders, pagination]) => {
        return { orders, pagination }
      })
  }
}
