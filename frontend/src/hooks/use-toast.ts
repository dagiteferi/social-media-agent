import * as React from "react"
import { toast as sonnerToast, type ExternalToast } from "sonner"

type ToastMessage = Parameters<typeof sonnerToast>[0];

type Toast = (message: ToastMessage, data?: ExternalToast) => string | number;

function useToast() {
  const toast: Toast = React.useCallback((message: ToastMessage, data?: ExternalToast) => {
    return sonnerToast(message, data)
  }, [])

  return { toast }
}

export { useToast }