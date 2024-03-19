import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const courseID = searchParams.get('id')!
    const newQuestions = parseInt(searchParams.get('q')!)
    const correctAnswers = parseInt(searchParams.get('c')!)

    const curCourse = await prisma.course.findFirst({
        where: {
            id: courseID
        }
    });
    const updatedCourse = await prisma.course.update({
        where: {
            id: courseID
        },
        data: {
            curStep: (curCourse?.curStep!)+1,
            totalQuestions: (curCourse?.totalQuestions!)+newQuestions,
            correctAnswers: (curCourse?.correctAnswers!)+correctAnswers,
        }
    });

    return NextResponse.json(updatedCourse)
}