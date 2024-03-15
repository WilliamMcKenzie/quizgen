import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const courseID = searchParams.get('id')!
    const fetchedCourse = await prisma.course.findFirst({
        where: {
            id: courseID
        }
    });

    return NextResponse.json(fetchedCourse)
}