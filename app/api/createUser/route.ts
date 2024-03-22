import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')!
    const password = searchParams.get('password')!

    const createdUser = await prisma.user.create({
        data: {
            email: email,
            password: password,
            courseDetails: "{}"
        }
    });

    return NextResponse.json(createdUser)
}