import { useEffect, useState } from 'react';

import { GridWidgetData } from '@portal/data-access/models';

interface CustomEventMap {
  gridFilterData: Partial<GridWidgetData>;
}

export const useCustomEvent = <
  TEventType extends keyof CustomEventMap,
  TDetail extends CustomEventMap[TEventType]
>(
  container: ShadowRoot | undefined,
  eventType: TEventType
) => {
  const [filterData, setFilterData] = useState<TDetail>();

  useEffect(() => {
    if (!container) return;

    function handleGridFilterChange(event: Event) {
      setFilterData((event as CustomEvent).detail);
    }

    container.host.addEventListener(eventType, handleGridFilterChange);
    return () => {
      container.host.removeEventListener(eventType, handleGridFilterChange);
    };
  }, [container, eventType]);

  return filterData;
};
