import { Link, useSearchParams } from '@remix-run/react'

export default function Pagination({
  totalPages,
  pageParam = 'page',
}: {
  totalPages: number
  pageParam?: string
}) {
  const [queryParams] = useSearchParams()
  const currentPage = Number(queryParams.get(pageParam) || 1)
  totalPages = Number(totalPages)

  const previousQuery = new URLSearchParams(queryParams)
  previousQuery.set(pageParam, `${currentPage - 1}`)
  const nextQuery = new URLSearchParams(queryParams)
  nextQuery.set(pageParam, `${currentPage + 1}`)

  return (
    <nav className="flex justify-between">
      {currentPage <= 1 && <span className="line-through">Previous</span>}
      {currentPage > 1 && <Link to={`?${previousQuery.toString()}`}>Prev</Link>}
      {currentPage >= totalPages && <span className="line-through">Next</span>}
      {currentPage < totalPages && (
        <Link to={`?${nextQuery.toString()}`}>Next</Link>
      )}
    </nav>
  )
}
