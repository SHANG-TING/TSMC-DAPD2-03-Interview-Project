import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Widget } from '@portal/data-access/models';

@Component({
  selector: 'app-text-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title">{{ data.title }}</div>
    <div class="content">
      <span
        [style.color]="data.options.color"
        [style.background-color]="data.options.background"
      >
        {{ data.options.content }}
      </span>
    </div>
  `,
  styleUrls: ['../general-widget.scss', './text-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextWidgetComponent {
  @Input() data!: Widget<'text'>;
}
