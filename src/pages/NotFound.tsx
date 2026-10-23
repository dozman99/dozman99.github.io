import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { PageBody, PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div>
      <PageHeader
        label="404"
        title="This route doesn't resolve"
        description="Nothing is deployed at this path. It may have moved, or the link had a typo."
      />
      <PageBody>
        <Button render={<Link to="/" />}>
          <ArrowLeft className="size-4" />
          Back to home
        </Button>
      </PageBody>
    </div>
  )
}
