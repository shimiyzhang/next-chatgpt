import { useState } from 'react'
import Head from 'next/head'
import IssueForm from '@/components/IssueForm'
import Loading from '@/components/Loading'
import { ChatGPT as ChatGPTIcon } from '@/components/Icons'
import markdownToHtml from '@/utils/markdownToHtml'

const chatGPT = 'https://rip4ge.laf.dev/chatGPT'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [list, setList] = useState<{ name: string; text: string }[]>([])
  const [parentMessageId, setParentMessageId] = useState('')

  const handleSubmit = async () => {
    console.log(process)

    setList([
      ...list,
      {
        name: 'You',
        text: prompt,
      },
    ])
    setLoading(true)
    const response = await fetch('/api/chatGPT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        // parentMessageId,
      }),
    })

    const data = await response.json()
    setParentMessageId(data.parentMessageId)
    const text = await markdownToHtml(data.text)
    setList((prev) => [
      ...prev,
      {
        name: 'chatGPT',
        text,
      },
    ])
    setLoading(false)
  }
  return (
    <>
      <Head>
        <title>ChatGPT</title>
        <meta name="og:title" content="ChatGPT" />
        <meta name="description" content="For personal testing chatGPT" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden p-4">
        {loading && <Loading />}
        {list.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <ChatGPTIcon className="mb-4 h-10 w-10" />
            <h1 className="mb-10 ml-auto mr-auto flex items-center justify-center gap-2 text-center text-4xl font-semibold text-gray-500 first-letter:sm:mb-16">
              ChatGPT
              <span className="rounded-md bg-yellow-200 px-1.5 py-0.5 text-xs uppercase text-yellow-900 md:text-sm">
                TEST
              </span>
            </h1>
          </div>
        )}
        <div className="mb-10 w-full max-w-3xl">
          {list.map((item, index) => (
            <div
              key={index}
              className={`${
                item.name === 'You' ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-50/50'
              } mb-2 flex w-full items-start gap-4 rounded-xl p-4`}
            >
              <div className="flex items-center justify-start">
                {item.name === 'You' ? (
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#5436DA] text-xs tracking-widest text-white">
                    Y
                  </div>
                ) : (
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#19c37d] p-1 text-white">
                    <ChatGPTIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-auto">
                <span className="text-sm text-gray-400">{item.name}</span>
                <span className="text-base" dangerouslySetInnerHTML={{ __html: item.text }}></span>
              </div>
            </div>
          ))}
        </div>
        <IssueForm prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmit} />
      </main>
    </>
  )
}
