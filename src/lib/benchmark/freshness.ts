export const STALE_BENCHMARK_DAYS = 10

export interface DatedScore {
  score: number
  data_teste?: string | null
}

export function filterFreshScores<T extends DatedScore>(rows: T[]): T[] {
  const datedMs = rows
    .map((r) => (r.data_teste ? new Date(r.data_teste).getTime() : NaN))
    .filter((ms) => Number.isFinite(ms))
  if (datedMs.length === 0) return rows

  const maxMs = Math.max(...datedMs)
  const cutoffMs = maxMs - STALE_BENCHMARK_DAYS * 86_400_000

  return rows.filter((r) => {
    if (!r.data_teste) return true
    const ms = new Date(r.data_teste).getTime()
    if (!Number.isFinite(ms)) return true
    return ms >= cutoffMs
  })
}
