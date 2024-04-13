import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const aiRequest = `Your job is to generate a duolingo style course in JSON format (must be valid json, instead of using "" for strings, ALWAYS use '') given the user inputs the subject of the course. Return an object & inside it have {content:[], name:""}. inside content I want an array of step objects (5-6) that each contain a 'name' property (Of that step) and up to 8 'question' objects, each question object with 2-5 possible 'responses' as an array (One of which is correct, make the one which is correct random index and not the same index each time) an integer which is the index of the correct response ('correctIndex') and the question itself ('question'). Each step represents a step in the learning process, for example to learn pixel art step 1 might be learning basic tools like eraser etc, and then step 2 would be skills like dithering and so on.`
  const prompt = searchParams.get('prompt')!
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    max_tokens: 3500,
    messages: [{ role: 'system', content: aiRequest }, { role: 'user', content: prompt }],
  });
 
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream, {
    headers: { 'X-RATE-LIMIT': 'lol' },
  });
}