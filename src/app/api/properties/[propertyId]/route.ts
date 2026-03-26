import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '../../../lib/dbConnect';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const { propertyId } = params;
  console.log('Deleting property with ID:', propertyId);

  if (!propertyId || typeof propertyId !== 'string') {
    console.log('Invalid property ID');
    return NextResponse.json({ message: 'Invalid property ID' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  if (!session || !session.user) {
    console.log('Unauthorized: No session or user');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;
  console.log('User email:', userEmail);

  if (!userEmail) {
    console.log('Unauthorized: No user email');
    return NextResponse.json({ message: 'Unauthorized: User email not found' }, { status: 401 });
  }

  try {
    console.log('Prisma client:', prisma);
    if (!prisma) {
      throw new Error('Prisma client is not initialized');
    }

    const property = await prisma.property.findUnique({
      where: { propertyId: propertyId },
      include: {
        homeProperty: true,
        pgProperty: true,
      },
    });
    console.log('Found property:', property);

    if (!property) {
      console.log('Property not found');
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    if (property.userEmail !== userEmail) {
      console.log('Forbidden: User does not own this property');
      return NextResponse.json({ message: 'Forbidden: You do not own this property' }, { status: 403 });
    }

    console.log('Starting deletion process');

    await prisma.$transaction(async (tx) => {
      if (property.homeProperty) {
        console.log('Deleting homeProperty');
        await tx.homeProperty.delete({
          where: { propertyId: propertyId },
        });
      }

      if (property.pgProperty) {
        console.log('Deleting pgProperty');
        await tx.pGProperty.delete({
          where: { propertyId: propertyId },
        });
      }

      console.log('Deleting main property');
      await tx.property.delete({
        where: { propertyId: propertyId },
      });
    });

    console.log('Property deleted successfully');
    return NextResponse.json({ message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting property:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: `Error deleting property: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred while deleting the property' }, { status: 500 });
    }
  }
}