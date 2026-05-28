import { Pencil, Reply, Trash2 } from 'lucide-react'

interface MessageActionToolbarProps {
  canMutate: boolean
  onDelete: () => void
  onEdit: () => void
  onReply: () => void
}

export function MessageActionToolbar({ canMutate, onDelete, onEdit, onReply }: MessageActionToolbarProps) {
  return (
    <div className="absolute right-2 top-0 z-10 hidden -translate-y-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-300/60 group-hover:flex">
      <button
        aria-label="메시지 수정"
        className="grid size-8 place-items-center text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
        disabled={!canMutate}
        onClick={onEdit}
        type="button"
      >
        <Pencil size={18} />
      </button>
      <span className="my-1 w-px bg-slate-200" />
      <button
        aria-label="답글 작성"
        className="grid size-8 place-items-center text-slate-900 transition-colors hover:bg-slate-100"
        onClick={onReply}
        type="button"
      >
        <Reply size={18} />
      </button>
      <span className="my-1 w-px bg-slate-200" />
      <button
        aria-label="메시지 삭제"
        className="grid size-8 place-items-center text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
        disabled={!canMutate}
        onClick={onDelete}
        type="button"
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}
