import { next } from '@vercel/edge'

export default function middleware() {
  return next()
}
