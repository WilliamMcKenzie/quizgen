import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const quiz = JSON.parse(searchParams.get('quiz')!)
    const authorID = searchParams.get('author')
    const createdQuiz = await prisma.quiz.create({
        data: {
            name: quiz!.quiz_name,
            code: generateCode(),
            ranking: {},
            content: JSON.stringify(quiz!.content),
        }
    });
    await prisma.user.update({
        where: {
            id: authorID!,
        },
        data: {
            quizzes: {
                connect: {
                    id: createdQuiz.id,
                },
            },
        },
    })

    return NextResponse.json(createdQuiz)
}

function generateCode() {
    var result = ""
    for (var i = 0; i < 5; i++) {
        if (Math.random() * 10 > 7) {
            result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random()*27)]
        }
        else {
            result += Math.floor(Math.random()*10).toString()
        }
    }
    return result
}
