import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { GridboxComponent } from './gridbox.component';
import { HEIGHT_UNIT } from './gridbox.constant';
import { Widget } from './gridbox.interface';

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

  @HostBinding('style.transform') transform!: string;
  @HostBinding('style.width.px') width!: number;
  @HostBinding('style.height.px') height!: number;

  gridboxComponent = inject(GridboxComponent);

  ngOnInit(): void {
    this.updateItemStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('widget' in changes) {
      this.updateItemStyle();
    }
  }

  updateItemStyle() {
    const colWidthUnit = this.gridboxComponent.columnWidthUnit;
    const { top, left, height, width } = this.widget.position;

    this.transform = `translate3d(${colWidthUnit * left}px, ${
      HEIGHT_UNIT * top
    }px, 0px)`;
    this.width = colWidthUnit * width;
    this.height = HEIGHT_UNIT * height;
  }
}
