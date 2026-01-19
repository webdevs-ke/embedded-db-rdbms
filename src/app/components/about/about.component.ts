import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { MarkdownService } from '../../services/markdown.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
  content?: SafeHtml
  private sub?: Subscription

  constructor(
    private route: ActivatedRoute,
    private md: MarkdownService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit () {
    this.sub = this.route.paramMap.subscribe(params => {
      const topic = params.get('topic')
      if (!topic) return

      this.md.load(`/docs/${topic}.md`).subscribe(html => {
        this.content = this.sanitizer.bypassSecurityTrustHtml(html)
      })
    })
  }
  
  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}