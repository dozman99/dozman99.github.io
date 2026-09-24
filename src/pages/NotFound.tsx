import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div>
      <PageHeader
        title="This route doesn't resolve"
        description="Nothing is deployed at this path. It may have moved, or the link had a typo."
      />
      <section className="px-4 pb-20 sm:px-6">
        <Button render={<Link to="/" />}>
          <ArrowLeft className="size-4" />
          Back to home
        </Button>
      </section>
    </div>
  )
}
