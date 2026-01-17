import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

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

  async saveTable(name: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve()
  
      const tx = this.db.transaction('tables', 'readwrite')
      tx.objectStore('tables').put(data, name)
  
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }  

  loadTable(name: string): Promise<any> {
    return new Promise(resolve => {
      if (!this.db) return resolve(null)
      const tx = this.db.transaction('tables')
      const req = tx.objectStore('tables').get(name)
      req.onsuccess = () => resolve(req.result)
    })
  }

  async deleteTable(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve()
  
      const tx = this.db.transaction('tables', 'readwrite')
      const store = tx.objectStore('tables')
  
      store.delete(name)
  
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  }  

  async tableExists(name: string): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.db) return resolve(false)
  
      const tx = this.db.transaction('tables', 'readonly')
      const req = tx.objectStore('tables').get(name)
  
      req.onsuccess = () => resolve(!!req.result)
      req.onerror = () => resolve(false)
    })
  }  

  iterateKeys(cb: (key: IDBValidKey) => void): Promise<void> {
    return new Promise(resolve => {
      const tx = this.db.transaction('tables')
      const store = tx.objectStore('tables')
      const req = store.openCursor()
  
      req.onsuccess = () => {
        const cursor = req.result
        if (!cursor) return resolve()
        cb(cursor.key)
        cursor.continue()
      }
    })
  }
  
  async deleteByPrefix(prefix: string) {
    const tx = this.db.transaction('tables', 'readwrite')
    const store = tx.objectStore('tables')
    const req = store.openCursor() 
    req.onsuccess = () => {
      const cursor = req.result
      if (!cursor) return
  
      const key = cursor.key
      if (typeof key === 'string' && key.startsWith(prefix)) {
        cursor.delete()
      }
      cursor.continue()
    }
  }  
}