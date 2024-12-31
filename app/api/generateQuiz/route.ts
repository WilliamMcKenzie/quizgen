import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export const runtime = 'edge';
 
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  var aiRequest = `Generate a JSON for a Duolingo-style quiz based on the user-provided subject. Format: {content:[], quiz_name:''}. content is an array of 3-5 step objects, each with name (the step's title) and 4-8 question objects. Each question has question (the prompt), responses (2-5 answer options, one correct at a random index), and correctIndex (the correct answer's index). Steps should reflect a learning progression (e.g., "Pixel Art" might start with tools, then skills like dithering). The number of questions and answer options should be varied between steps to feel dynamic, and same with which is the correct index. If any of the users inputs are nonsensical, please return this: { "content" : [], "quiz_name" : 'INVALID_INPUTS'}. `
  
  const prompt = searchParams.get('prompt')!
  const customized = searchParams.get('customized')!
  const difficulty = searchParams.get('difficulty')!
  const steps = searchParams.get('steps')?.split(",")!

  if (customized) {
    aiRequest += ' BONUS CUSTOMIZATION: In a 1-10 scale of difficulty, this quiz should be a ' + difficulty + '. It should have exactly ' + steps.length.toString() + ", each step is as follows: "
    for (var step in steps) {
      aiRequest += step + ", "
    }
  }
 
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    max_tokens: 4000,
    messages: [{ role: 'system', content: aiRequest }, { role: 'user', content: prompt }],
  });
 
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream, {
    headers: { 'X-RATE-LIMIT': 'lol' },
  });
}