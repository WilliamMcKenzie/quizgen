import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const course = JSON.parse(searchParams.get('course')!)
    const currentUserID = searchParams.get('id')
    const createdCourse = await prisma.course.create({
        data: {
            name: course!.name,
            content: JSON.stringify(course!.content),
            curStep: 0,
            users: {
                connect: { id: "652e8627c5b93270f995b82e" }
            }
        }
    });

    return NextResponse.json(createdCourse)
}