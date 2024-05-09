import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Widget } from '../../../../shared/ui/gridbox/gridbox.interface';

@Component({
  selector: 'app-text-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title">Text Widget</div>
    <div class="content">
      <span
        [style.color]="data.options.color"
        [style.background-color]="data.options.background"
      >
        {{ data.options.content }}
      </span>
    </div>
  `,
  styleUrl: './text-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextWidgetComponent {
  @Input() data!: Widget<{
    color: string;
    background: string;
    content: string;
  }>;
}
