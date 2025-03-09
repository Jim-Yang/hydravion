export type FPContentList = FPContent[]

export interface Image {
  width: number
  height: number
  path: string
  childImages: ChildImage[]
}

export interface ChildImage {
  width: number
  height: number
  path: string
}

export interface Channel {
  id: string
  creator: string
  title: string
  urlname: string
  about: string
  order: number
  cover: Image | null
  card: Image | null
  icon: Image
}

export interface LiveStreamInfo {
  id: string
  title: string
  description: string
  thumbnail: Image
  owner: string
  channel: string
  streamPath: string
  offline: {
    title: string
    description: string
    thumbnail: Image
  }
}

export interface SubscriptionPlan {
  id: string
  title: string
  description: string
  price: string
  priceYearly: string
  currency: string
  logo: any
  interval: string
  featured: boolean
  allowGrandfatheredAccess: boolean
  discordServers: any[]
  discordRoles: any[]
  enabled: boolean
  enabledGlobal: boolean
}

export interface SocialLinks {
  instagram: string
  website: string
  facebook: string
  youtube: string
  twitter: string
}

export interface Creator {
  id: string
  owner: {
    id: string
    username: string
  }
  title: string
  urlname: string
  description: string
  about: string
  category: {
    id: string
    title: string
  }
  cover: Image
  icon: Image
  card: Image
  liveStream: LiveStreamInfo
  subscriptionPlans: SubscriptionPlan[]
  discoverable: boolean
  subscriberCountDisplay: string
  incomeDisplay: boolean
  defaultChannel: string
  socialLinks: SocialLinks
  channels: string[]
}

export interface ContentMetadata {
  hasVideo: boolean
  videoCount: number
  videoDuration: number
  hasAudio: boolean
  audioCount: number
  audioDuration: number
  hasPicture: boolean
  pictureCount: number
  isFeatured: boolean
  displayDuration: number
  hasGallery: boolean
  galleryCount: number
}

export interface FPContent {
  id: string
  guid: string
  title: string
  text: string
  type: string
  channel: Channel
  tags: any[]
  attachmentOrder: string[]
  releaseDate: string
  likes: number
  dislikes: number
  score: number
  comments: number
  creator: Creator
  wasReleasedSilently: boolean
  metadata: ContentMetadata
  galleryAttachments: any[]
  selfUserInteraction: any
  thumbnail: Image
  isAccessible: boolean
  videoAttachments: string[]
  audioAttachments: any[]
  pictureAttachments: any[]
}
