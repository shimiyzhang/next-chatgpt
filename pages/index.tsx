import { useEffect, useState } from 'react'
import Head from 'next/head'
import IssueForm from '@/components/IssueForm'
import Loading from '@/components/Loading'
import { ChatGPT as ChatGPTIcon, Delete as DeleteIcon } from '@/components/Icons'
import markdownToHtml from '@/utils/markdownToHtml'

const chatGPT = 'https://rip4ge.laf.dev/chatGPT'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [list, setList] = useState<{ name: string; text: string; error?: boolean }[]>([])
  const [parentMessageId, setParentMessageId] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageList = localStorage.getItem('chatList')
      if (storageList) {
        setList(JSON.parse(storageList))
      }
      const storageParentMessageId = localStorage.getItem('parentMessageId')
      if (storageParentMessageId) {
        setParentMessageId(storageParentMessageId)
      }
    }
  }, [])

  const handleSubmit = async () => {
    const initList = list
    setList([
      ...list,
      {
        name: 'You',
        text: prompt,
      },
    ])
    initList.push({
      name: 'You',
      text: prompt,
    })
    setLoading(true)

    const response = await fetch(chatGPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        parentMessageId,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setParentMessageId(data.parentMessageId)
      localStorage.setItem('parentMessageId', data.parentMessageId)
      const text = await markdownToHtml(data.text)
      setList((prev) => [
        ...prev,
        {
          name: 'chatGPT',
          text,
        },
      ])
      initList.push({
        name: 'chatGPT',
        text,
      })
    } else {
      setList((prev) => [
        ...prev,
        {
          name: 'chatGPT',
          text: 'Something went wrong, please try again later.',
          error: true,
        },
      ])
      initList.push({
        name: 'chatGPT',
        text: 'Something went wrong, please try again later.',
        error: true,
      })
    }
    localStorage.setItem('chatList', JSON.stringify(initList))
    setLoading(false)
  }

  const handleDelete = () => {
    setList([])
    localStorage.removeItem('chatList')
    setParentMessageId('')
    localStorage.removeItem('parentMessageId')
  }

  return (
    <>
      <Head>
        <title>ChatGPT</title>
        <meta name="og:title" content="ChatGPT" />
        <meta name="description" content="For personal testing chatGPT" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-start overflow-y-auto p-4">
        {loading && <Loading />}
        {list.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <ChatGPTIcon className="mb-4 h-10 w-10" />
            <h1 className="mb-10 ml-auto mr-auto flex items-center justify-center gap-2 text-center text-4xl font-semibold text-gray-500 first-letter:sm:mb-16">
              ChatGPT
              <span className="rounded-md bg-yellow-200 px-1.5 py-0.5 text-xs uppercase text-yellow-900 md:text-sm">
                TEST
              </span>
            </h1>
          </div>
        ) : (
          <div className="mb-16 w-full max-w-3xl md:mb-16">
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
                  <span
                    className={`${item.error ? 'text-red-500' : ''} text-base`}
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  ></span>
                </div>
              </div>
            ))}
            <div className="flex w-full items-center justify-center">
              <button onClick={handleDelete}>
                <DeleteIcon className="h-6 w-6 text-gray-500 hover:text-red-500 focus:text-red-500" />
              </button>
            </div>
          </div>
        )}
        <IssueForm prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmit} />
      </main>
    </>
  )
}
