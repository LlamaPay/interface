import * as React from 'react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, DataZoomComponent } from 'echarts/components';
import { useTheme } from 'next-themes';

echarts.use([CanvasRenderer, LineChart, TooltipComponent, DataZoomComponent]);

export default function VestingChart() {
  const id = React.useId();

  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const series = React.useMemo(() => {
    const chartColor = 'green';

    const series = {
      name: '',
      type: 'line',
      stack: 'value',
      emphasis: {
        focus: 'series',
        shadowBlur: 10,
      },
      symbol: 'none',
      itemStyle: {
        color: chartColor,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: chartColor,
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, 0.2)',
          },
        ]),
      },
      data: [],
    };

    return series;
  }, []);

  const createInstance = React.useCallback(() => {
    const element = document.getElementById(id);
    if (element) {
      const instance = echarts.getInstanceByDom(element);

      return instance || echarts.init(element);
    }
  }, [id]);

  React.useEffect(() => {
    // create instance
    const chartInstance = createInstance();

    if (!chartInstance) return;

    chartInstance.setOption({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        nameTextStyle: {
          fontFamily: 'inter, sans-serif',
          fontSize: 14,
          fontWeight: 400,
        },
        axisLine: {
          lineStyle: {
            color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
            opacity: 0.2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
            opacity: 0.1,
          },
        },
        boundaryGap: false,
        nameTextStyle: {
          fontFamily: 'inter, sans-serif',
          fontSize: 14,
          fontWeight: 400,
          color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
        },
        splitLine: {
          lineStyle: {
            color: '#a1a1aa',
            opacity: 0.1,
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
      series,
    });

    function resize() {
      chartInstance?.resize();
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      chartInstance.dispose();
    };
  }, [id, isDark, series, createInstance]);

  return <div id={id} style={{ height: '360px', margin: 'auto 0' }}></div>;
}
