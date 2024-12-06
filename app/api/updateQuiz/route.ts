import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get('uid')!
    const quizID = searchParams.get('qid')!

    const newQuestions = parseInt(searchParams.get('q')!)
    const correctAnswers = parseInt(searchParams.get('c')!)
    const step = parseInt(searchParams.get('step')!)+1

    const curUser = await prisma.user.findFirst({
        where: {
            id: userID
        }
    });

    var tempQuizDetails
    if (JSON.parse(curUser!.quizDetails)) {
        tempQuizDetails = JSON.parse(curUser!.quizDetails)
    } else {
        tempQuizDetails = {}
    }
    tempQuizDetails[quizID] = {
        q: (tempQuizDetails[quizID]?.q ?? 0) + newQuestions,
        c: (tempQuizDetails[quizID]?.c ?? 0) + correctAnswers,
        step: step
    };


    const updatedUser = await prisma.user.update({
        where: {
            id: userID
        },
        data: {
            quizDetails: JSON.stringify(tempQuizDetails)
        }
    });

    return NextResponse.json(updatedUser)
}