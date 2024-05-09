import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Widget } from '../../../../shared/ui/gridbox/gridbox.interface';

@Component({
  selector: 'app-grid-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title">Grid Widget</div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th *ngFor="let header of data.options.headers">
              {{ header.displayText }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data.options.data">
            <td *ngFor="let header of data.options.headers">
              {{ item?.[header.fieldId] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: [
    '../general-widget.scss',
    './grid-widget.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridWidgetComponent {
  @Input() data!: Widget<'grid'>;
}
