import { useRef } from 'react'
import { Airport } from './Icons'

export type Props = {
  prompt: any
  setPrompt: (value: string) => void
  handleSubmit: () => void
}

export default function ButtomForm({ prompt, setPrompt, handleSubmit }: Props) {
  const textare = useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    if (textare.current) {
      setPrompt(textare.current.value)

      // 重置textarea的高度，使其回到默认的一行高度
      textare.current.style.height = 'auto'

      // 获取textarea的滚动高度
      var scrollHeight = textare.current.scrollHeight

      // 设置textarea的高度，限制最大高度为200px
      textare.current.style.height = scrollHeight > 200 ? '200px' : scrollHeight + 'px'
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
    if (textare.current) {
      setPrompt('')
      textare.current.style.height = 'auto'
    }
  }

  return (
    <div className="md:bg-vert-light-gradient fixed bottom-0 left-0 w-full border-t bg-white pt-2 md:border-t-0 md:border-transparent md:!bg-transparent">
      <form className="stretch mx-2 flex max-w-[44rem] flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="">
            <div className="ml-1 flex h-full justify-center gap-0 md:m-auto md:mb-2 md:w-full md:gap-2"></div>
          </div>
          <div className="relative flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white py-2 shadow-[0_0_10px_rgba(0,0,0,0.10)] md:py-3 md:pl-4">
            <textarea
              ref={textare}
              rows={1}
              placeholder="Send a message..."
              className="m-0 h-6 max-h-[200px] w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 outline-none focus:ring-0 focus-visible:ring-0 md:pl-0"
              value={prompt}
              onInput={handleInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  submit(e)
                }
              }}
            ></textarea>
            <button
              className="absolute bottom-1.5 right-1 rounded-md p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent md:bottom-2.5 md:right-2"
              disabled={!prompt}
              onClick={submit}
            >
              <Airport className="mr-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
