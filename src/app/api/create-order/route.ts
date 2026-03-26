import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY, 
  key_secret: process.env.RAZORPAY_SECRET_KEY, 
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency } = await req.json();

    
    const options = {
      amount: amount, 
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}

export const GET = () => {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
};
