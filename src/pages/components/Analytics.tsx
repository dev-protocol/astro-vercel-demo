import { Analytics } from '@vercel/analytics/react'

export const VercelAnalytics = () => {
  return (
    <Analytics
      mode={
        import.meta.env.MODE === 'production' ? 'production' : 'development'
      }
    />
  )
}
