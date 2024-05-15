import React, { useEffect, useMemo, useRef, useState } from 'react';

import ReactDOM from 'react-dom/client';
import r2wc from 'react-to-webcomponent';
import styled, { StyleSheetManager } from 'styled-components';

import { GridWidgetData, Widget } from '@portal/data-access/models';

export interface SuperGridWidgetProps {
  data: Widget<'super-grid'>;
}

const StyledSuperGridWidget = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  .title {
    font-size: 1rem;
    font-weight: bold;
    height: 50px;
    display: flex;
    padding: 0 10px;
    align-items: center;
    border-bottom: 1px solid black;
  }
  .content {
    flex-grow: 1;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border: 1px solid black;
    box-sizing: border-box;
    table-layout: fixed;
  }

  th,
  td {
    text-align: left;
    padding: 10px;
  }

  th {
    background-color: black;
    color: white;
  }

  tbody td {
    background-color: #c8c8c8;
  }

  tbody tr:nth-child(even) td {
    background-color: #e6e6e6;
  }
`;

export function SuperGridWidget({ data }: SuperGridWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [filterData, setFilterData] = useState<Partial<GridWidgetData>>({});

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const customElement = ref.current.parentElement;

    function handleGridFilterChange(event: Event) {
      setFilterData((event as CustomEvent).detail);
    }

    customElement?.addEventListener('gridFilterChange', handleGridFilterChange);
    return () => {
      customElement?.removeEventListener(
        'gridFilterChange',
        handleGridFilterChange
      );
    };
  }, []);

  const dataItems = useMemo(() => {
    const dataItems = data.options.data ?? [];

    if (
      data.options.headers?.every(
        (header: { fieldId: string }) => !(header.fieldId in filterData)
      )
    ) {
      return dataItems;
    }

    return dataItems.filter((item) => {
      return Object.entries(filterData).every(([key, value]) =>
        item[key as keyof GridWidgetData]
          ?.toLowerCase()
          .includes(value?.toLowerCase())
      );
    });
  }, [data.options.data, data.options.headers, filterData]);

  return (
    <StyleSheetManager>
      <StyledSuperGridWidget ref={ref}>
        <div className="title">{data.title}</div>
        <div className="content">
          <table>
            <thead>
              <tr>
                {data.options.headers?.map((header) => (
                  <th key={header.fieldId}>{header.displayText}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataItems.map((item, i) => (
                <tr key={i}>
                  {data.options.headers?.map((header) => (
                    <td key={header.fieldId}>{item[header.fieldId]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StyledSuperGridWidget>
    </StyleSheetManager>
  );
}

export function definedCustomElement() {
  const tagName = 'super-grid-widget';

  if (customElements.get(tagName)) {
    return;
  }

  const superGridWidget = r2wc(SuperGridWidget, React, ReactDOM, {
    props: {
      data: 'json',
    },
  });
  customElements.define(tagName, superGridWidget);
}

export default SuperGridWidget;
