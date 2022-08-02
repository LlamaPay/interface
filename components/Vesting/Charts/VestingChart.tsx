import * as React from 'react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, DataZoomComponent, GridComponent, MarkLineComponent } from 'echarts/components';
import { useTheme } from 'next-themes';

echarts.use([CanvasRenderer, LineChart, TooltipComponent, DataZoomComponent, GridComponent, MarkLineComponent]);

interface IVestingChartProps {
  amount: number;
  vestingPeriod: number;
  cliffPeriod: number | null;
  startTime: Date;
  vestedDays?: string | null;
}

export default function VestingChart({
  amount,
  vestingPeriod,
  cliffPeriod,
  startTime,
  vestedDays,
}: IVestingChartProps) {
  const id = React.useId();

  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const series = React.useMemo(() => {
    const chartColor = '#14b8a6';

    const series = [
      {
        name: 'To Vest',
        type: 'line',
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
              color: !isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
          ]),
        },
        data: [...Array(vestingPeriod + 1)].map((_, index) => [
          new Date(new Date(startTime).setDate(startTime.getDate() + index)),
          index >= (cliffPeriod || 0) ? (amount / vestingPeriod) * index : 0,
        ]),
        ...(cliffPeriod && {
          markLine: {
            data: [
              [
                {
                  name: 'CLIFF',
                  xAxis: new Date(new Date(startTime).setDate(startTime.getDate() + cliffPeriod)),
                  yAxis: 0,
                  label: {
                    color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
                    fontFamily: 'inter, sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                  },
                },
                {
                  name: 'end',
                  xAxis: new Date(new Date(startTime).setDate(startTime.getDate() + cliffPeriod)),
                  yAxis: 'max',
                },
              ],
            ],
          },
        }),
      },
    ];

    if (vestedDays) {
      series.push({
        name: 'Vested',
        type: 'line',
        emphasis: {
          focus: 'series',
          shadowBlur: 10,
        },
        symbol: 'none',
        itemStyle: {
          color: 'red',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'red',
            },
            {
              offset: 1,
              color: !isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
          ]),
        },
        data: [...Array(Number(vestedDays))].map((_, index) => [
          new Date(new Date().setDate(startTime.getDate() + index)),
          (amount / vestingPeriod) * index,
        ]),
      });
    }

    return series;
  }, [amount, vestingPeriod, startTime, cliffPeriod, isDark, vestedDays]);

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
        formatter: function (params: any) {
          const chartdate = new Date(params[0].value[0]).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          const vals = params.reduce((prev: string, curr: any) => {
            return (prev +=
              '<li style="list-style:none">' +
              curr.marker +
              curr.seriesName +
              '&nbsp;&nbsp;' +
              (curr.value[1] ? curr.value[1]?.toFixed(4) : curr.value[1]) +
              '</li>');
          }, '');

          return chartdate + vals;
        },
      },
      grid: {
        left: 0,
        containLabel: true,
        bottom: 20,
        top: 40,
        right: 0,
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
      animation: false,
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
