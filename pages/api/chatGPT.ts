// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

function getOpenAI() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  return new OpenAIApi(configuration)
}

export const chatGPT = async (req: NextApiRequest, res: NextApiResponse) => {
  const openai = getOpenAI()
  const { prompt } = req.body

  const completion = await openai.createCompletion({
    model: 'gpt-3.5-turboprop-chatbot',
    prompt: prompt,
  })

  res.status(200).json(completion)
}
