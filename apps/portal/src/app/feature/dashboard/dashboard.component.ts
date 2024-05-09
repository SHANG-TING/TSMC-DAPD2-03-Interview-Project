import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { GridboxComponent } from '../../shared/ui/gridbox/gridbox.component';
import { GridboxConfig } from '../../shared/ui/gridbox/gridbox.interface';
import {
  GridWidgetComponent,
} from './widgets/grid-widget/grid-widget.component';
import {
  TextWidgetComponent,
} from './widgets/text-widget/text-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2>dashboard works!</h2>
    <button (click)="addTextWidget()" style="margin: 10px 0;">Add Text Widget</button>
    <app-gridbox [config]="config">
      <ng-template #widget let-data>
        @defer (when data.type === 'text') {
        <app-text-widget [data]="data"></app-text-widget>
        } @defer (when data.type === 'grid') {
        <app-grid-widget [data]="data"></app-grid-widget>
        }
      </ng-template>
    </app-gridbox>
  `,
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GridboxComponent,
    TextWidgetComponent,
    GridWidgetComponent,
  ],
})
export class DashboardComponent {
  config: GridboxConfig = {
    widgets: [
      {
        id: 'widget-01',
        title: 'Grid 1',
        type: 'grid',
        position: {
          left: 0,
          top: 0,
          width: 6,
          height: 3,
        },
        options: {
          headers: [
            { fieldId: 'name', displayText: 'User Name' },
            { fieldId: 'role', displayText: 'User Role' },
          ],
          data: [{ name: 'Mike', role: 'Engineer' }],
        },
      },
      {
        id: 'widget-02',
        title: 'Text 1',
        type: 'text',
        position: {
          left: 0,
          top: 3,
          width: 3,
          height: 3,
        },
        options: {
          content: 'Hello World',
          color: 'white',
          background: '#f00',
        },
      },
    ],
  };

  addTextWidget() {
    this.config = {
      ...this.config,
      widgets: [
        ...this.config.widgets,
        {
          id: 'widget-03',
          title: 'Text 2',
          type: 'text',
          position: {
            left: 6,
            top: 6,
            width: 3,
            height: 3,
          },
          options: {
            content: 'Good night.',
            color: 'yellow',
            background: '#666',
          },
        },
      ],
    };
  }
}
