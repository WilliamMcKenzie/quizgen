import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const course = JSON.parse(searchParams.get('course')!)
    const createdCourse = await prisma.course.create({
        data: {
            name: course!.name,
            content: JSON.stringify(course!.content)
        }
    });

    return NextResponse.json(createdCourse)
}