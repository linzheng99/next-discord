"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useJoinServer } from "@/features/servers/api/use-join-server"
import { useInviteCode } from "@/features/servers/hooks/use-invite-code"

interface JoinServerFormProps {
  initialValues: {
    id: string
    name: string
  }
}

export default function JoinServerForm({ initialValues }: JoinServerFormProps) {
  const router = useRouter()
  const { name, id } = initialValues
  const inviteCode = useInviteCode()
  const { mutate, isPending } = useJoinServer()

  function handleCancel() {
    router.push('/')
  }
  function handleJoin() {
    mutate({
      param: { serverId: id },
      json: { inviteCode }
    }, {
      onSuccess: () => {
        router.push(`/servers/${id}`)
      }
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>加入服务器</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>您已被邀请加入</span>
          <strong>{name}</strong>
          <span>服务器</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
      </CardContent>
      <CardFooter className="w-full flex flex-col lg:flex-row justify-center gap-2">
        <Button variant="outline" onClick={handleCancel} className="w-full lg:w-auto">取消</Button>
        <Button onClick={handleJoin} disabled={isPending} type="submit" className="w-full lg:w-auto">加入</Button>
      </CardFooter>
    </Card>
  )
}
