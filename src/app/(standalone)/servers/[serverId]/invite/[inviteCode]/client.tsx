"use client"

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetServer } from "@/features/servers/api/use-get-server";
import JoinServerForm from "@/features/servers/components/join-server-form";
import { useServerId } from "@/features/servers/hooks/use-server-id";

export default function ServerIdJoinClient() {
  const serverId = useServerId()
  const { data: initialValues, isLoading } = useGetServer(serverId)

  if (isLoading) return <PageLoader />
  if (!initialValues) return <PageError message="Workspace not found" />

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full md:max-w-lg px-4">
        <JoinServerForm initialValues={initialValues} />
      </div>
    </div>
  )
}
