export function ExpenseLedger({ expenses, loading }) {
  return (
    <section className="rounded-[28px] border border-white/12 bg-slate-950/50 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.3)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-sky-200/75">Transparency Ledger</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-50">Expense History</h2>
        </div>
        <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-100">
          Public record
        </div>
      </div>

      <div className="max-h-130 overflow-hidden rounded-3xl border border-white/8 bg-slate-950/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8 text-left text-sm">
            <thead className="bg-white/4 text-xs uppercase tracking-[0.24em] text-slate-300/70">
              <tr>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Purpose</th>
                <th className="px-5 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-slate-100">
              {loading ? (
                <tr>
                  <td className="px-5 py-8 text-slate-300" colSpan="3">
                    Loading expense history...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-slate-300" colSpan="3">
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="transition hover:bg-white/4">
                    <td className="px-5 py-4 text-slate-300">{expense.dateLabel}</td>
                    <td className="px-5 py-4 text-slate-50">{expense.purpose}</td>
                    <td className="px-5 py-4 text-right font-semibold text-cyan-200">
                      {expense.amountEth} ETH
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
