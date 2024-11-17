import { UserButton } from "@clerk/nextjs"

import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <UserButton />
      <ModeToggle />
    </div>
  )
}
