import { useState } from "react"

import ResponsiveModal from '@/components/responsive-modal';
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function useConfirm(
  title: string,
  message: string,
  variant: ButtonProps['variant'] = 'default'
): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

  function confirm() {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }

  function handleClose() {
    setPromise(null)
  }

  function handleConfirm() {
    promise?.resolve(true)
    handleClose()
  }

  function handleCancel() {
    promise?.resolve(false)
    handleClose()
  }


  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal
        open={promise !== null}
        onOpenChange={() => handleClose()}
      >
        <Card className="border-none" >
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-400">
              {message}
            </p>
          </CardContent>
          <CardFooter className="flex w-full gap-4 justify-center" >
            <Button variant="outline" className="w-full md:w-auto" onClick={() => handleCancel()}>
              Cancel
            </Button>
            <Button variant={variant} className="w-full md:w-auto" onClick={() => handleConfirm()}>
              Confirm
            </Button>
          </CardFooter>
        </Card>
      </ResponsiveModal>
    )
  }

  return [ConfirmationDialog, confirm]
}
