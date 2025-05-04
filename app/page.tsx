import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the Flowise UI
  redirect("/api/flowise")

  return null
}
