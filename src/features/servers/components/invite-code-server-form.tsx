"use client"

import { Check, Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/hooks/use-modal-store";
import { useServerId } from "@/hooks/use-server-id";
import { type ServerWithMembersWithProfiles } from "@/types"

import { useOrigin } from '../../../hooks/use-origin';
import { useResetInviteCode } from "../api/use-reset-invite-code";

export default function InviteCodeServerForm() {
  const origin = useOrigin()
  const serverId = useServerId()
  const { data: { server } } = useModalStore()
  const inviteLink = `${origin}/servers/${server?.id}/invite/${server?.inviteCode}`

  const [isCopied, setIsCopied] = useState(false)
  const { mutate, isPending } = useResetInviteCode()
  const { onOpen } = useModalStore()

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink)
    setIsCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  function handleReset() {
    mutate({ param: { serverId } }, {
      onSuccess: ({ data }) => {
        onOpen('invite', { server: data as unknown as ServerWithMembersWithProfiles })
      }
    })
  }

  return (
    <Card className="text-primary p-0 overflow-hidden">
      <CardHeader className="pt-8 px-6">
        <CardTitle className="text-2xl font-bold text-center">Invite Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Label className="uppercase">Server Invite Link</Label>
          <div className="flex items-center gap-x-2">
            <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-primary focus-visible:ring-offset-0" readOnly value={inviteLink} disabled={isPending} />
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={isPending}>
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button variant="primary" className="w-full" disabled={isPending} onClick={() => handleReset()}>
            Generate New Link
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
