import { useState } from 'react'

export function ContributeCard({ onContribute, feedback }) {
  const [amount, setAmount] = useState('0.05')
  const isPending = feedback.action === 'contribute' && feedback.phase === 'pending'
  const showFeedback = feedback.action === 'contribute' && feedback.phase !== 'idle'

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await onContribute(amount)
      setAmount('')
    } catch {
      // Feedback is already surfaced by the treasury hook.
    }
  }

  return (
    <section className="rounded-[28px] border border-white/12 bg-white/6 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">Contribute</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-50">Support the club treasury</h2>
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
          Open to all members
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-200/80">
          <span>Amount in ETH</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70"
            min="0"
            step="0.001"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.05"
          />
        </label>

        <button
          className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? 'Processing...' : 'Donate to Club'}
        </button>
      </form>

      {showFeedback ? (
        <p
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            feedback.phase === 'success'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
              : 'border-rose-400/30 bg-rose-400/10 text-rose-100'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </section>
  )
}
