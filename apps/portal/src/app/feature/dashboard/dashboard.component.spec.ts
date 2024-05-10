import { DashboardComponent } from './dashboard.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

describe('Test Dashboard', () => {
  let spectator: Spectator<DashboardComponent>;
  const createComponent = createComponentFactory(DashboardComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  test('should render text widget', () => {
    const textWidget = spectator.query('app-text-widget');
    expect(textWidget).toBeTruthy();

    spectator.detectChanges();
    expect(textWidget?.textContent).toContain('Text Widget');
    expect(textWidget?.textContent).toContain('Hello World');
  });

  test('should render grid widget', () => {
    const gridWidget = spectator.query('app-grid-widget');
    expect(gridWidget).toBeTruthy();

    spectator.detectChanges();
    expect(gridWidget?.textContent).toContain('Grid Widget');
    expect(gridWidget?.textContent).toContain('User Name');
    expect(gridWidget?.textContent).toContain('Role');
    expect(gridWidget?.textContent).toContain('Mike');
    expect(gridWidget?.textContent).toContain('Engineer');
  });
});
