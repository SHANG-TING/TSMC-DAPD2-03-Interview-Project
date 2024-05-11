import { DashboardComponent } from './dashboard.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

describe('Test Dashboard', () => {
  let spectator: Spectator<DashboardComponent>;
  const createComponent = createComponentFactory(DashboardComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  test('should render grid widget', () => {
    const gridWidget = spectator.query('#widget-01');
    expect(gridWidget).toBeTruthy();

    spectator.detectChanges();
    expect(gridWidget?.textContent).toContain('Grid 1');
    expect(gridWidget?.textContent).toContain('User Name');
    expect(gridWidget?.textContent).toContain('Role');
    expect(gridWidget?.textContent).toContain('Mike');
    expect(gridWidget?.textContent).toContain('Engineer');
  });

  test('should render text widget', () => {
    const textWidget = spectator.query('#widget-02');
    expect(textWidget).toBeTruthy();

    spectator.detectChanges();
    expect(textWidget?.textContent).toContain('Text 1');
    expect(textWidget?.textContent).toContain('Hello World');
  });

  test('should render new grid widget when click add-grid-widget-button', () => {
    let newGridWidget = spectator.query('#widget-04');
    expect(newGridWidget).toBeNull();

    spectator
      .query<HTMLButtonElement>('[data-e2e-id="add-grid-widget-button"]')
      ?.click();
    spectator.detectChanges();

    newGridWidget = spectator.query('#widget-03');

    expect(newGridWidget?.textContent).toContain('Grid 2');
    expect(newGridWidget?.textContent).toContain('User Name');
    expect(newGridWidget?.textContent).toContain('Role');
    expect(newGridWidget?.textContent).toContain('Jeff');
    expect(newGridWidget?.textContent).toContain('Declan');
    expect(newGridWidget?.textContent).toContain('Engineer');
  });

  test('should render new text widget when click add-text-widget-button', () => {
    let newTextWidget = spectator.query('#widget-06');
    expect(newTextWidget).toBeNull();

    spectator
      .query<HTMLButtonElement>('[data-e2e-id="add-text-widget-button"]')
      ?.click();
    spectator.detectChanges();

    newTextWidget = spectator.query('#widget-04');

    expect(newTextWidget?.textContent).toContain('Text 2');
    expect(newTextWidget?.textContent).toContain('Good night.');
  });
});
