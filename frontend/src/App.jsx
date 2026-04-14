import { useState } from 'react'
import { AdminPanel } from './components/AdminPanel.jsx'
import { ContributeCard } from './components/ContributeCard.jsx'
import { ExpenseLedger } from './components/ExpenseLedger.jsx'
import { useTreasury } from './hooks/useTreasury.js'

function App() {
  const [role, setRole] = useState('admin')
  const treasury = useTreasury(role)
  const isAdmin = role === 'admin'

  const connectedLabel = treasury.activeWalletAddress
    ? `${isAdmin ? 'Admin' : 'Member'} · ${treasury.activeWalletAddress.slice(0, 6)}...${treasury.activeWalletAddress.slice(-4)}`
    : `${isAdmin ? 'Admin' : 'Member'} · wallet not configured`

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_40%),linear-gradient(180deg,#07111f_0%,#020817_100%)] text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-treasury-accent/70">Blockchain Finance</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Campus Club Treasury</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
                Public balance, owner-only spending, and a live expense ledger for transparent club accounting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-treasury-accent/25 bg-treasury-accent/10 px-4 py-2 text-sm text-cyan-100">
                🟢 Connected as: {isAdmin ? 'Admin' : 'Member'}
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2">
                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Switch Role</span>
                <div className="rounded-full bg-white/5 p-1">
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isAdmin ? 'bg-treasury-accent text-slate-950' : 'text-slate-300 hover:text-slate-50'
                    }`}
                    onClick={() => setRole('admin')}
                    type="button"
                  >
                    Admin
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      !isAdmin ? 'bg-treasury-accent text-slate-950' : 'text-slate-300 hover:text-slate-50'
                    }`}
                    onClick={() => setRole('member')}
                    type="button"
                  >
                    Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {!treasury.isConfigured ? (
          <section className="mb-6 rounded-[28px] border border-amber-300/20 bg-amber-200/10 px-5 py-4 text-sm text-amber-50">
            Configure frontend/.env with VITE_CONTRACT_ADDRESS, VITE_ADMIN_KEY, and VITE_STUDENT_KEY to connect the dashboard.
          </section>
        ) : null}

        {treasury.error ? (
          <section className="mb-6 rounded-[28px] border border-rose-300/20 bg-rose-200/10 px-5 py-4 text-sm text-rose-50">
            {treasury.error}
          </section>
        ) : null}

        <section className="mb-6 rounded-4xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-[0_32px_90px_rgba(15,23,42,0.3)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Total Treasury Balance</p>
          <div className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {treasury.loading ? 'Loading...' : `${treasury.balanceEth} ETH`}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300/80">{connectedLabel}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-300/80">
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-2">
              Contract: {treasury.contractAddress || 'not configured'}
            </span>
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-2">
              Local node: {import.meta.env.VITE_RPC_URL ?? 'http://127.0.0.1:8545'}
            </span>
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-2">
              {isAdmin ? 'Admin' : 'Member'} contribution: {treasury.contributionEth} ETH
            </span>
          </div>
        </section>

        <div className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.2fr]">
          <div className="space-y-6">
            <ContributeCard feedback={treasury.feedback} onContribute={treasury.contribute} />

            {treasury.canWithdraw ? (
              <AdminPanel feedback={treasury.feedback} onWithdraw={treasury.withdraw} />
            ) : (
              <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-slate-300/80 shadow-[0_32px_80px_rgba(15,23,42,0.3)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Admin Panel</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-50">Withdrawals locked in Member mode</h2>
                <p className="mt-3 text-sm leading-6">
                  Switch to Admin to reveal the onlyOwner withdrawal panel and demonstrate access control live.
                </p>
              </section>
            )}
          </div>

          <ExpenseLedger expenses={treasury.expenses} loading={treasury.loading} />
        </div>
      </div>
    </main>
  )
}

export default App
