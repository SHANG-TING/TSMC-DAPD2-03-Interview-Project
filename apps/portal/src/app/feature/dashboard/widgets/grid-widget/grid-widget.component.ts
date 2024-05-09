import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Widget } from '../../../../shared/ui/gridbox/gridbox.interface';

type GridHeader = {
  displayText: string;
  fieldId: keyof GridData;
};
type GridData = {
  [key: string]: string;
};

@Component({
  selector: 'app-grid-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title">Grid Widget</div>
    <div class="content">
      <table>
        <tr>
          <th *ngFor="let header of data.options.headers">
            {{ header.displayText }}
          </th>
        </tr>
        <tr *ngFor="let item of data.options.data">
          <td *ngFor="let header of data.options.headers">
            {{ item?.[header.fieldId] }}
          </td>
        </tr>
      </table>
    </div>
  `,
  styleUrl: './grid-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridWidgetComponent {
  @Input() data!: Widget<{
    headers: GridHeader[];
    data: GridData[];
  }>;
}
