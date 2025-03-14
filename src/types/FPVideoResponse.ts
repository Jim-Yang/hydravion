export interface FPVideoResponse {
  cdn: string
  strategy: string
  resource: Resource
}

export interface Resource {
  uri: string
  data: Data
}

export interface Data {
  qualityLevelParams: Record<string, Record<"2" | "4", string>>
  qualityLevels: QualityLevel[]
}

export interface QualityLevel {
  name: string
  label: string
  order: number
  width: number
  height: number
  mimeType: string
  codecs: string
}
