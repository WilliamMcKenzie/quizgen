import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get('uid')!
    const courseID = searchParams.get('cid')!

    const newQuestions = parseInt(searchParams.get('q')!)
    const correctAnswers = parseInt(searchParams.get('c')!)
    const step = parseInt(searchParams.get('step')!)+1

    const curUser = await prisma.user.findFirst({
        where: {
            id: userID
        }
    });

    var tempCD
    if (JSON.parse(curUser!.courseDetails)) {
        tempCD = JSON.parse(curUser!.courseDetails)
    } else {
        tempCD = {}
    }
    tempCD[courseID] = {
        q: (tempCD[courseID]?.q ?? 0) + newQuestions,
        c: (tempCD[courseID]?.c ?? 0) + correctAnswers,
        step: step
      };


    const updatedUser = await prisma.user.update({
        where: {
            id: userID
        },
        data: {
            courseDetails: JSON.stringify(tempCD)
        }
    });

    return NextResponse.json(updatedUser)
}