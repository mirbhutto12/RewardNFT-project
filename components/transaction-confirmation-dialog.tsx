"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

interface TransactionConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  amount?: string
  recipient?: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  transactionType?: "sol" | "usdt"
}

export function TransactionConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  amount,
  recipient,
  onConfirm,
  onCancel,
  transactionType = "usdt",
}: TransactionConfirmationDialogProps) {
  const { explorerUrl } = useWallet()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [signature, setSignature] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setStatus("loading")
      await onConfirm()
      setStatus("success")
      // Auto-close after success
      setTimeout(() => {
        setStatus("idle")
        onOpenChange(false)
      }, 3000)
    } catch (error: any) {
      setStatus("error")
      setErrorMessage(error.message || "Transaction failed")
    }
  }

  const handleCancel = () => {
    if (status === "loading") return
    setStatus("idle")
    onCancel()
  }

  const openExplorer = () => {
    if (signature) {
      window.open(`${explorerUrl}/tx/${signature}`, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {status === "error" ? (
          <div className="bg-red-500/10 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-500">Transaction Failed</p>
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          </div>
        ) : status === "success" ? (
          <div className="bg-green-500/10 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-500">Transaction Successful</p>
              <p className="text-sm text-green-400">Your transaction has been confirmed.</p>
              {signature && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-green-400 hover:text-green-500"
                  onClick={openExplorer}
                >
                  View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-medium">{amount}</span>
              </div>
            )}

            {recipient && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recipient:</span>
                <span className="font-medium truncate max-w-[200px]">{recipient}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Token:</span>
              <span className="font-medium">{transactionType === "usdt" ? "USDT" : "SOL"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Network:</span>
              <span className="font-medium">Solana Devnet</span>
            </div>

            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <p className="text-sm text-yellow-500">
                Please review the transaction details carefully before confirming. This action cannot be undone.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={status === "loading"}>
            Cancel
          </Button>

          {status !== "success" && (
            <Button type="button" onClick={handleConfirm} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
