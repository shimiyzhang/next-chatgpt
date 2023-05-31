import { Loading as LoadingIcon } from './Icons'

export default function Loading() {
  return (
    <div className="fixed z-50 flex h-screen w-screen items-center justify-center">
      <LoadingIcon className="h-10 w-10 animate-spin text-white" />
    </div>
  )
}
