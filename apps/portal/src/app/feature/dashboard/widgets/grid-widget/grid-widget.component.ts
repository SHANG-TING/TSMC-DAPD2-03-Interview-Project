import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';

import { map } from 'rxjs/operators';

import { DashboardService } from '../../dashboard.service';
import { GridWidgetData, Widget } from '@portal/data-access/models';

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
          @if (dataItems$ | async; as dataItems) { @for(item of dataItems; track
          $index) {
          <tr>
            @for (header of data.options.headers; track header.fieldId) {
            <td>{{ item?.[header.fieldId] }}</td>
            }
          </tr>
          } }
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['../general-widget.scss', './grid-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridWidgetComponent {
  @Input() data!: Widget<'grid'>;

  #dashboardService = inject(DashboardService);

  dataItems$ = this.#dashboardService.gridFilterChange$.pipe(
    map((filterData) => {
      const dataItems = this.data.options.data ?? [];

      if (
        this.data.options.headers?.every(
          (header) => !(header.fieldId in filterData)
        )
      ) {
        return dataItems;
      }

      if (Object.values(filterData).every((value) => !value)) {
        return dataItems;
      }

      return dataItems.filter((item) => {
        return Object.entries(filterData).every(([key, value]) =>
          item[key as keyof GridWidgetData]
            ?.toString()
            .toLowerCase()
            .includes(value?.toString()?.toLowerCase())
        );
      });
    })
  );
}
