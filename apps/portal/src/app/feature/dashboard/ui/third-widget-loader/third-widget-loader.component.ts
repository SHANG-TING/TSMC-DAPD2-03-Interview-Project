import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';

import { Subject } from 'rxjs';

import { DashboardService } from '../../dashboard.service';

const THIRD_WIDGET_MAP = {
  'super-grid-widget': async () =>
    (
      await import('@portal/third-widgets/super-grid-widget')
    ).definedCustomElement(),
} as const;

@Component({
  selector: 'app-third-widget-loader',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styleUrl: './third-widget-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdWidgetLoaderComponent implements AfterViewInit, OnDestroy {
  @Input()
  tagName!: keyof typeof THIRD_WIDGET_MAP;

  @Input()
  attrs: Record<string, unknown> = {};

  #dashboardService = inject(DashboardService);
  #elmRef: ElementRef<HTMLElement> = inject(ElementRef);
  #renderer = inject(Renderer2);
  #zone = inject(NgZone);
  #componentDestroyed = new Subject<void>();

  async ngAfterViewInit() {
    if (!(this.tagName in THIRD_WIDGET_MAP)) {
      return;
    }

    await THIRD_WIDGET_MAP[this.tagName]();

    this.#zone.runOutsideAngular(() => {
      const elm = this.#renderer.createElement(this.tagName);

      this.#renderer.setProperty(
        elm,
        'dashboardService',
        this.#dashboardService
      );

      for (const [key, value] of Object.entries(this.attrs)) {
        if (Array.isArray(value) || typeof value === 'object') {
          this.#renderer.setAttribute(elm, key, JSON.stringify(value));
        } else {
          this.#renderer.setAttribute(elm, key, `${value}`);
        }
      }

      this.#renderer.appendChild(this.#elmRef.nativeElement, elm);
    });
  }

  ngOnDestroy(): void {
    this.#componentDestroyed.next();
    this.#componentDestroyed.complete();
  }
}
