import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { marked } from 'marked'
import { map } from 'rxjs/operators'

@Injectable({ 
  providedIn: 'root' 
})
export class MarkdownService {
  constructor(private http: HttpClient) {}

  load(path: string) {
    return this.http
      .get(path, { responseType: 'text' })
      .pipe(map(md => marked.parse(md, { async: false }) as string))
  }
}