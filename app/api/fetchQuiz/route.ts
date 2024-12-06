import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const quizID = searchParams.get('id')!
    const fetchedQuiz = await prisma.quiz.findFirst({
        where: {
            code: quizID
        }
    });

    return NextResponse.json(fetchedQuiz)
}