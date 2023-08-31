import { Controller, Get, Inject } from '@nestjs/common';
import { STRIPE_CLIENT } from '../constants';
import { Stripe } from 'stripe';

@Controller('customer')
export class CustomerController {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  @Get('/')
  find() {
    return this.stripe.customers.list();
  }
}
