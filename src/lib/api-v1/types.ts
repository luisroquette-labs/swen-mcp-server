export interface NewsItem {
  slug: string
  title: string
  summary: string | null
  category: string | null
  publishedAt: string | null
  updatedAt: string | null
  source: string | null
  url: string
  imageUrl: string | null
}

export interface ModelItem {
  slug: string
  name: string
  vendor: string
  type: string | null
  inputPricePerMillionTokens: number | null
  outputPricePerMillionTokens: number | null
  contextWindow: number | null
  tokensPerSecond: number | null
  timeToFirstTokenMs: number | null
  isOpenSource: boolean
  logoUrl: string | null
  url: string
}

export interface RankingItem {
  rank: number
  slug: string
  name: string
  vendor: string
  score: number
  url: string
}

export interface ToolItem {
  slug: string
  name: string
  summary: string | null
  category: string | null
  subcategory: string | null
  pricingModel: string | null
  startingPriceUsd: number | null
  averageRating: number | null
  reviewCount: number | null
  hasApi: boolean
  isOpenSource: boolean
  logoUrl: string | null
  websiteUrl: string | null
  url: string
}

export interface TutorialItem {
  slug: string
  title: string
  summary: string | null
  category: string | null
  difficulty: string | null
  publishedAt: string | null
  updatedAt: string | null
  url: string
}

export interface ApiMeta {
  count: number
  source: string
  updatedAt: string | null
}

export interface ApiSuccess<T> {
  data: T
  meta?: ApiMeta
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}
