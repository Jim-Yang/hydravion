export interface FloatplaneResponse {
  settings: CreatorSetting[]
  emailNotificationsEnabled: boolean
}

export interface CreatorSetting {
  creator: Creator
  channels: ChannelSubscription[]
}

export interface Creator {
  id: string
  owner: Owner
  title: string
  urlname: string
  description: string
  about: string
  category: Category
  cover: ImageAsset
  icon: ImageAsset
  card: ImageAsset
  liveStream: LiveStream
  subscriptionPlans: SubscriptionPlan[]
  discoverable: boolean
  subscriberCountDisplay: string
  incomeDisplay: boolean
  defaultChannel: string
  socialLinks: SocialLinks
  channels: Channel[]
}

export interface Owner {
  id: string
  username: string
}

export interface Category {
  id: string
  title: string
}

export interface ImageAsset {
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

export interface LiveStream {
  id: string
  title: string
  description: string
  thumbnail: ImageAsset
  owner: string
  channel: string
  streamPath: string
  offline: OfflineStream
}

export interface OfflineStream {
  title: string
  description: string
  thumbnail: ImageAsset
}

export interface SubscriptionPlan {
  id: string
  title: string
  description: string
  price: string
  priceYearly: string
  currency: string
  logo: ImageAsset | null
  interval: string
  featured: boolean
  allowGrandfatheredAccess: boolean
  discordServers: DiscordServer[]
  discordRoles: DiscordRole[]
  enabled: boolean
  enabledGlobal: boolean
}

export interface DiscordServer {
  // Add Discord server properties when needed
}

export interface DiscordRole {
  // Add Discord role properties when needed
}

export interface SocialLinks {
  instagram: string
  website: string
  facebook: string
  youtube: string
  twitter: string
}

export interface Channel {
  id: string
  creator: string
  title: string
  urlname: string
  about: string
  order: number
  cover: ImageAsset | null
  card: ImageAsset | null
  icon: ImageAsset
}

export interface ChannelSubscription {
  channel: string
  enabled: boolean
}
  