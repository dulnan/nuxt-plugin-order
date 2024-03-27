import { type Ref, useState } from '#imports'
import type { SiteData } from '~/plugins/provideApi'

export type GlobalData = {
  fetched: boolean
  site: SiteData
}

export default function (): Ref<GlobalData> {
  const globalData = useState<GlobalData>('globalData', () => {
    return {
      fetched: false,
      site: {
        siteName: '',
      },
    }
  })

  return globalData
}
