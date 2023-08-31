import { DynamicModule, Module, Provider } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Stripe } from 'stripe';
import { STRIPE_PROVIDER } from '../constants';

@Module({
  providers: [StripeService],
})
export class StripeModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);
    const stripeProvider: Provider = {
      provide: STRIPE_PROVIDER,
      useValue: stripe,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true,
    };
  }
}
