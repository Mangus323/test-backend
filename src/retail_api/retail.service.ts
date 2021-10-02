import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { ConcurrencyManager } from 'axios-concurrency'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {},
      params: {
        apiKey: 'IYE6DnRXyKs6hQAcFb2hNLCwg0QvP6NW',
      },
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url)
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        // console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return [orders, pagination]
  }

  async findOrder(id: string): Promise<Order | null> {
    const filter: OrdersFilter = {
      filter: {
        ids: [+id],
      },
    }

    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)


    const order = plainToClass(Order, resp.data.orders[0])
    return order
  }

  async orderStatuses(): Promise<CrmType[]> {
    return
  }

  async productStatuses(): Promise<CrmType[]> {
    return
  }

  async deliveryTypes(): Promise<CrmType[]> {
    return
  }
}
