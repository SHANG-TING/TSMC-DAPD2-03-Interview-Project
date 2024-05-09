import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { GridboxComponent } from './gridbox.component';
import { Widget } from './gridbox.interface';
import { HEIGHT_UNIT } from './gridbox.constant';

@Component({
  selector: 'app-gridbox-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (this.gridboxComponent.widgetTemplateRef) {
    <ng-container
      *ngTemplateOutlet="
        this.gridboxComponent.widgetTemplateRef;
        context: { $implicit: widget, i: index }
      "
    ></ng-container>
    }
  `,
  styleUrl: './gridboxItem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridboxItemComponent implements OnInit, OnChanges {
  @Input() index!: number;
  @Input() widget!: Widget;

  gridboxComponent = inject(GridboxComponent);

  #elRef = inject(ElementRef);
  #renderer = inject(Renderer2);

  ngOnInit(): void {
    this.#updateItemStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('widget' in changes) {
      this.#updateItemStyle();
    }
  }

  #updateItemStyle() {
    const colWidthUnit = this.gridboxComponent.columnWidthUnit;
    const { top, left, height, width } = this.widget.position;

    this.#renderer.setStyle(
      this.#elRef.nativeElement,
      'transform',
      `translate3d(${colWidthUnit * left}px, ${HEIGHT_UNIT * top}px, 0px)`
    );
    this.#renderer.setStyle(
      this.#elRef.nativeElement,
      'width',
      `${colWidthUnit * width}px`
    );
    this.#renderer.setStyle(
      this.#elRef.nativeElement,
      'height',
      `${HEIGHT_UNIT * height}px`
    );
  }
}
