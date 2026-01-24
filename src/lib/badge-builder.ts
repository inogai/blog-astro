export interface BadgeConfig {
  type: string
}

export function buildBadges(fields: Record<string, any>): BadgeConfig[] {
  const badges: BadgeConfig[] = []

  for (const [key, value] of Object.entries(fields)) {
    if (value != null && value !== false && value !== '') {
      badges.push({ type: `${key}:${value}` })
    }
  }

  return badges
}
