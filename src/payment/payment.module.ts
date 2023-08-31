import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from './stripe/stripe.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [StripeModule.forRoot('', { apiVersion: '2023-08-16' }), CustomerModule], // FIXME
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
