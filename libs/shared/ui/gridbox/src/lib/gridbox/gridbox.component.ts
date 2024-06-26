import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
} from '@angular/core';

import { Widget } from '@portal/data-access/models';

import { COLUMN_COUNT, HEIGHT_UNIT } from './gridbox.constant';
import { GridboxConfig } from './gridbox.interface';
import { GridboxItemComponent } from './gridboxItem.component';

@Component({
  selector: 'app-gridbox',
  standalone: true,
  imports: [CommonModule, GridboxItemComponent],
  template: `
    @for (col of gridColumns; track $index) {
    <div class="gridbox-column" [ngStyle]="getGridColumnStyle($index)"></div>
    } @for (row of gridRows; track $index) {
    <div class="gridbox-row" [ngStyle]="getGridRowStyle($index)"></div>
    } @for (widget of config.widgets; track widget.id) {
    <app-gridbox-item
      [attr.id]="widget.id"
      [widget]="widget"
    ></app-gridbox-item>
    }
  `,
  styleUrl: './gridbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridboxComponent implements OnChanges {
  @ContentChild('widget') widgetTemplateRef?: TemplateRef<{
    $implicit: Widget;
    i: number;
  }>;
  @Input() config: GridboxConfig = {
    widgets: [],
  };

  @ViewChildren(GridboxItemComponent)
  gridboxItemComponents?: QueryList<GridboxItemComponent>;

  @HostBinding('style.height.px') height?: number;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.#updateGridStyle();
    this.gridboxItemComponents?.forEach((item) => item.updateItemStyle());
  }

  gridColumns = Array(COLUMN_COUNT);
  gridRows = [];

  #elRef: ElementRef<HTMLElement> = inject(ElementRef);
  #cdRef = inject(ChangeDetectorRef);

  get columnWidthUnit() {
    const elm = this.#elRef.nativeElement;
    return elm.clientWidth / this.gridColumns.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('config' in changes) {
      this.#updateGridStyle();
    }
  }

  getGridColumnStyle(index: number) {
    const colUnitWidth = this.columnWidthUnit;
    return {
      transform: `translateX(${index * colUnitWidth}px)`,
      height: `${this.gridRows.length * HEIGHT_UNIT}px`,
      width: `${colUnitWidth}}px`,
    };
  }

  getGridRowStyle(index: number) {
    const elm = this.#elRef.nativeElement;
    return {
      transform: `translateY(${index * HEIGHT_UNIT}px)`,
      height: `${HEIGHT_UNIT}px`,
      width: `${elm.clientWidth}px`,
      ...(index % 2 === 1 && {
        backgroundColor: 'hsl(120deg 30.35% 39.41% / 18.04%)',
      }),
    };
  }

  #updateGridStyle() {
    this.gridRows.length = Math.max(
      ...this.config.widgets.map(
        ({ position: { top, height } }) => top + height
      )
    );
    this.height = this.gridRows.length * HEIGHT_UNIT;
    this.#cdRef.markForCheck();
  }
}
