import { NextRequest, NextResponse } from 'next/server';
import { encryptAmount } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    const encryptedAmount = encryptAmount(numericAmount);
    const encodedAmount = encodeURIComponent(encryptedAmount);
    
    const paymentLink = `${process.env.NEXT_PUBLIC_SITE_URL}/pay/${encodedAmount}`;

    return NextResponse.json({
      success: true,
      paymentLink,
      amount: numericAmount
    });
  } catch (error) {
    console.error('Error generating generic payment link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}