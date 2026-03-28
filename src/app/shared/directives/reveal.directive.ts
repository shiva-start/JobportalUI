import { AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealOrigin = 'up' | 'left' | 'right';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input() revealDistance = 24;
  @Input() revealOrigin: RevealOrigin = 'up';
  @Input() revealOnce = true;

  private observer?: IntersectionObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.addClass(element, 'reveal');
    this.renderer.setStyle(element, '--reveal-delay', `${this.revealDelay}ms`);
    this.renderer.setStyle(element, '--reveal-distance', `${this.revealDistance}px`);
    this.renderer.addClass(element, `reveal-from-${this.revealOrigin}`);

    if (!isPlatformBrowser(this.platformId) || this.prefersReducedMotion()) {
      this.renderer.addClass(element, 'reveal-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            if (!this.revealOnce) {
              this.renderer.removeClass(element, 'reveal-visible');
            }
            continue;
          }

          this.renderer.addClass(element, 'reveal-visible');

          if (this.revealOnce) {
            this.observer?.unobserve(element);
          }
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
