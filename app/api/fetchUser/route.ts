import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')!
    const password = searchParams.get('password')!

    var fetchedUser

    try {
        fetchedUser = await prisma.user.findFirstOrThrow({
            where: {
                email: email,
                password: password
            }
        });
    }
    catch (error) {
        fetchedUser = {id: null}
    }

    return NextResponse.json(fetchedUser)
}