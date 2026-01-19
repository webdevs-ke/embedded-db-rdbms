import { RenderMode, ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'about/:topic',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { topic: 'ngdb' },
      { topic: 'sql-help' },
      { topic: 'indexeddb' },
      { topic: 'angular' },
    ]
  },
]
