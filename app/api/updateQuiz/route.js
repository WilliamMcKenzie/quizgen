import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get('uid')
    const quizID = searchParams.get('qid')

    const newQuestions = parseInt(searchParams.get('q'))
    const correctAnswers = parseInt(searchParams.get('c'))
    const step = parseInt(searchParams.get('step'))+1

    const curUser = await prisma.user.findFirst({
        where: {
            id: userID
        }
    });

    var tempQuizDetails
    if (JSON.parse(curUser.quizDetails)) {
        tempQuizDetails = JSON.parse(curUser.quizDetails)
    } else {
        tempQuizDetails = {}
    }

    const invalid = (tempQuizDetails[quizID]?.step ?? 0) > step
    if (!invalid) {
        tempQuizDetails[quizID] = {
            q: (tempQuizDetails[quizID]?.q ?? 0) + newQuestions,
            c: (tempQuizDetails[quizID]?.c ?? 0) + correctAnswers,
            step: step
        };
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userID
        },
        data: {
            quizDetails: JSON.stringify(tempQuizDetails)
        }
    })

    const quiz = await prisma.quiz.findFirst({
        where : {
            code : quizID
        }
    })
    if (JSON.parse(quiz.content).length == step) {
        var ranking = quiz?.ranking
        ranking[curUser.email] = [tempQuizDetails[quizID].c, tempQuizDetails[quizID].q]

        await prisma.quiz.updateMany({
            where: {
                code : quizID
            },
            data: {
                ranking : ranking
            }
        })
    }

    return NextResponse.json(updatedUser)
}