// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DataSourceConstructor} from '../../..';
import {expect} from '@loopback/testlab';
import {OrderRepository} from './repositories/order.repository';
import {CustomerRepository} from './repositories/customer.repository';
import {memoryDs} from './fixtures/datasources/memory.datasource';
import {Customer} from './models/customer.model';
import {Order} from './models/order.model';

describe('hasMany relationship', () => {
  let orderRepo: OrderRepository;
  let customerRepo: CustomerRepository;
  beforeEach(givenCustomerAndOrderRepositories);

  it('creates a customer with an order and retrieves it', async () => {
    const c1: Customer = await customerRepo.create({
      name: 'John Smith',
      slug: 'johnsmith@yahoo.com',
    });
    c1.orders.create({
      desc: 'order1 description',
      date: new Date().toISOString(),
      customerId: c1.getId(),
    });
    let found = await customerRepo.findById(c1.id);
    expect(found).to.have.properties({
      name: c1.name,
      email: c1.email,
      orders: [
        {
          desc: 'order1 description',
          customerId: c1.getId(),
        },
      ],
    });
    expect(c1).instanceof(Customer);
    let foundOrder = await orderRepo.findById(c1.id);
    expect(foundOrder).to.have.properties({
      desc: 'order1 description',
      customerId: c1.getId(),
    });
  });

  function givenCustomerAndOrderRepositories() {
    orderRepo = new OrderRepository(memoryDs);
    customerRepo = new CustomerRepository(memoryDs);
  }
});
