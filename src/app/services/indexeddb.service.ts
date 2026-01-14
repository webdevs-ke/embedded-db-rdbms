import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBDatabase
  private isBrowser: boolean
  private opened = false

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  async open() {
    if(this.opened) return
    if(typeof window === 'undefined' || !window.indexedDB) return

    this.opened = true
    // if(!this.isBrowser) {
    //   throw new Error ("IndexeDB not available outside browser")
    // }

    return new Promise<void>((resolve, reject) => {
      const req = window.indexedDB.open('ng-embed-rdbms', 1)

      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains('tables')) {
          db.createObjectStore('tables')
        }
      }

      req.onsuccess = () => {
        this.db = req.result
        resolve()
      }

      req.onerror = () => reject(req.error)
    })
  }

  saveTable(name: string, data: any) {
    const tx = this.db.transaction('tables', 'readwrite')
    tx.objectStore('tables').put(data, name)
  }

  loadTable(name: string): Promise<any> {
    return new Promise(resolve => {
      const tx = this.db.transaction('tables')
      const req = tx.objectStore('tables').get(name)
      req.onsuccess = () => resolve(req.result)
    })
  }
}
