import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import contractJson from '../abi/ClubTreasury.json'

const rpcUrl = import.meta.env.VITE_RPC_URL ?? 'http://127.0.0.1:8545'
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS ?? ''
const provider = new ethers.JsonRpcProvider(rpcUrl)
const treasuryAbi = contractJson.abi

const adminKey = import.meta.env.VITE_ADMIN_KEY ?? ''
const studentKey = import.meta.env.VITE_STUDENT_KEY ?? ''

const adminWallet = adminKey ? new ethers.Wallet(adminKey, provider) : null
const studentWallet = studentKey ? new ethers.Wallet(studentKey, provider) : null

function getRoleWallet(role) {
  return role === 'admin' ? adminWallet : studentWallet
}

function formatError(error) {
  if (typeof error?.reason === 'string' && error.reason.length > 0) {
    return error.reason
  }

  if (typeof error?.shortMessage === 'string' && error.shortMessage.length > 0) {
    return error.shortMessage
  }

  if (typeof error?.message === 'string' && error.message.length > 0) {
    return error.message.split('\n')[0]
  }

  return 'Transaction failed'
}

async function fetchTreasurySnapshot(walletAddress) {
  if (!contractAddress) {
    throw new Error('Set VITE_CONTRACT_ADDRESS in frontend/.env')
  }

  const contract = new ethers.Contract(contractAddress, treasuryAbi, provider)
  const [balanceWei, expenseItems, contributionWei] = await Promise.all([
    contract.getBalance(),
    contract.getExpenses(),
    contract.getContribution(walletAddress),
  ])

  const expenses = expenseItems
    .map((expense, index) => ({
      id: `${expense.timestamp}-${index}`,
      dateLabel: new Date(Number(expense.timestamp) * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      purpose: expense.purpose,
      amountEth: ethers.formatEther(expense.amount),
    }))
    .reverse()

  return {
    balanceEth: ethers.formatEther(balanceWei),
    contributionEth: ethers.formatEther(contributionWei),
    expenses,
  }
}

export function useTreasury(role) {
  const [balanceEth, setBalanceEth] = useState('0.00')
  const [contributionEth, setContributionEth] = useState('0.00')
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({ action: null, phase: 'idle', message: '' })
  const [error, setError] = useState('')

  const activeWallet = getRoleWallet(role)
  const activeWalletAddress = activeWallet?.address ?? ethers.ZeroAddress

  const refreshTreasury = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const snapshot = await fetchTreasurySnapshot(activeWalletAddress)
      setBalanceEth(snapshot.balanceEth)
      setContributionEth(snapshot.contributionEth)
      setExpenses(snapshot.expenses)
    } catch (snapshotError) {
      setError(formatError(snapshotError))
      setContributionEth('0.00')
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }, [activeWalletAddress])

  useEffect(() => {
    void refreshTreasury()
  }, [role, refreshTreasury])

  async function contribute(amountEth) {
    if (!activeWallet) {
      throw new Error('Set wallet keys in frontend/.env')
    }

    if (!amountEth || Number(amountEth) <= 0) {
      throw new Error('Enter a contribution amount')
    }

    if (!contractAddress) {
      throw new Error('Set VITE_CONTRACT_ADDRESS in frontend/.env')
    }

    const contract = new ethers.Contract(contractAddress, treasuryAbi, activeWallet)

    setFeedback({ action: 'contribute', phase: 'pending', message: 'Processing contribution...' })
    setError('')

    try {
      const transaction = await contract.contribute({ value: ethers.parseEther(amountEth) })
      await transaction.wait()
      await refreshTreasury()
      setFeedback({ action: 'contribute', phase: 'success', message: '✅ Contribution confirmed' })
    } catch (contributionError) {
      const message = formatError(contributionError)
      setFeedback({ action: 'contribute', phase: 'error', message: `❌ ${message}` })
      throw contributionError
    }
  }

  async function withdraw(amountEth, purpose) {
    if (!adminWallet) {
      throw new Error('Set VITE_ADMIN_KEY in frontend/.env')
    }

    if (!amountEth || Number(amountEth) <= 0) {
      throw new Error('Enter a withdrawal amount')
    }

    if (!purpose || purpose.trim().length === 0) {
      throw new Error('Enter a withdrawal purpose')
    }

    if (!contractAddress) {
      throw new Error('Set VITE_CONTRACT_ADDRESS in frontend/.env')
    }

    const contract = new ethers.Contract(contractAddress, treasuryAbi, adminWallet)

    setFeedback({ action: 'withdraw', phase: 'pending', message: 'Processing withdrawal...' })
    setError('')

    try {
      const transaction = await contract.withdraw(ethers.parseEther(amountEth), purpose.trim())
      await transaction.wait()
      await refreshTreasury()
      setFeedback({ action: 'withdraw', phase: 'success', message: '✅ Withdrawal confirmed' })
    } catch (withdrawError) {
      const message = formatError(withdrawError)
      setFeedback({ action: 'withdraw', phase: 'error', message: `❌ ${message}` })
      throw withdrawError
    }
  }

  return {
    activeWalletAddress: activeWallet?.address ?? '',
    balanceEth,
    canWithdraw: role === 'admin',
    contributionEth,
    contractAddress,
    error,
    expenses,
    feedback,
    loading,
    refreshTreasury,
    contribute,
    withdraw,
    isConfigured: Boolean(contractAddress && adminWallet && studentWallet),
  }
}
