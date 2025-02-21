import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/talk')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/talk"!</div>
}
