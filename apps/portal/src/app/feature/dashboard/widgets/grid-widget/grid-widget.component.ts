import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Widget } from '../../../../shared/ui/gridbox/gridbox.interface';

@Component({
  selector: 'app-grid-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title">{{ data.title }}</div>
    <div class="content">
      <table>
        <thead>
          <tr>
            @for (header of data.options.headers; track header.fieldId) {
            <th>{{ header.displayText }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for(item of data.options.data; track $index) {
          <tr>
            @for (header of data.options.headers; track header.fieldId) {
            <td>{{ item?.[header.fieldId] }}</td>
            }
          </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['../general-widget.scss', './grid-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridWidgetComponent {
  @Input() data!: Widget<'grid'>;
}
