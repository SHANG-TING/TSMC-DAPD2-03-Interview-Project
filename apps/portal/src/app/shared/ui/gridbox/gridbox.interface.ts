export interface GridboxConfig {
  widgets: Widget[];
}

export interface Widget<TOptions = object> {
  id: string;
  title: string;
  type: string;
  position: WidgetPosition;
  options: TOptions;
}

export interface WidgetOptions {
  headers?: WidgetHeader[];
  data?: WidgetData[];
  content?: string;
  color?: string;
  background?: string;
}

interface WidgetData {
  name: string;
  role: string;
}

interface WidgetHeader {
  fieldId: keyof WidgetData;
  displayText: string;
}

interface WidgetPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}
