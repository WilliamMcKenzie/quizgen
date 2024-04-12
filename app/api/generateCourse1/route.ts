import openai from '@/app/utils/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const aiRequest = `Your job is to generate a duolingo style course in JSON format (must be valid json) in around 3600 tokens or under given the user inputs the subject of the course. Return an object & inside it have {content:[], name:""}. inside content I want an array of step objects (4-8 depending on complexity of subject) that each contain a 'name' property (Of that step) and 2-4 'question' objects, each question object with 4 possible 'responses' as an array (One of which is correct, make the one which is correct random index and not the same index each time, ex. if a correct index is 0 make the next questions correct index not 0) an integer which is the index of the correct response ('correctIndex') and the question itself ('question'). Each step represents a step in the learning process, for example to learn pixel art step 1 might be learning basic tools like eraser etc, and then step 2 would be skills like dithering and so on.`
    const prompt = searchParams.get('prompt')!
    var completeMessage = ""
    var completeJSON = 0

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: aiRequest }, { role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 4000,
        temperature: 0.1,
        stream: true
    });

    const encoder = new TextEncoder()

    async function* makeIterator() {
        for await (const chunk of chatCompletion) {
            const delta = chunk.choices[0].delta.content as string;
            completeMessage += delta;
            if(delta == "{") completeJSON++
            else if(delta == "}") completeJSON--
            if(delta != undefined){
                yield encoder.encode(completeJSON == 0 ? `${completeMessage}` : `${delta}`)
            }
        }
    }

    return new Response(iteratorToStream(makeIterator()))
}

function iteratorToStream(iterator: any) {
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next()
  
        if (done) {
          controller.close()
        } else {
          controller.enqueue(value)
        }
      },
    })
  }