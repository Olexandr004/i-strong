import type { Metadata, Viewport } from 'next'

export const initialMetadata: Metadata = {
  title: {
    default: 'IStrong',
    template: 'IStrong',
  },
  description: 'IStrong',
  keywords: ['Психолог'],
  applicationName: 'I Strong',
  openGraph: {
    title: {
      default: 'IStrong',
      template: 'IStrong',
    },
    description: 'IStrong',
    siteName: 'IStrong',
    locale: 'uk',
    // images: '/logo.png',
    type: 'website',
  },
}

export const initialViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff',
  colorScheme: 'only light',
}
