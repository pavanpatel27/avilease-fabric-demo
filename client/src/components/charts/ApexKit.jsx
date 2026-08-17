import Chart from 'react-apexcharts';

/** Shared Prodigy × AviLease chart theme (Figma-like dashboard polish) */
export const BRAND = {
  crimson: '#EC0051',
  saffron: '#FFC600',
  deep: '#003B51',
  teal: '#00697B',
  mint: '#50B9A1',
  muted: '#6b6b6b',
  line: '#E8E8E8',
  ink: '#272727',
};

export const PALETTE = [
  BRAND.crimson,
  BRAND.deep,
  BRAND.mint,
  BRAND.saffron,
  BRAND.teal,
  '#9a9a9a',
];

export function ApexBarHorizontal({ categories, series, height = 260, onSelect }) {
  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Lexend Deca, sans-serif',
      events: {
        dataPointSelection: (_e, _ctx, cfg) => {
          const cat = categories[cfg.dataPointIndex];
          if (cat && onSelect) onSelect(cat);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '62%',
        distributed: true,
      },
    },
    colors: PALETTE,
    dataLabels: {
      enabled: true,
      style: { fontSize: '11px', fontWeight: 600, colors: ['#fff'] },
    },
    xaxis: {
      categories,
      labels: { style: { colors: BRAND.muted, fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: BRAND.ink, fontSize: '11px', fontWeight: 600 } },
    },
    grid: { borderColor: BRAND.line, strokeDashArray: 4 },
    legend: { show: false },
    tooltip: {
      theme: 'light',
      y: { formatter: (v) => `${v} aircraft` },
    },
  };

  return (
    <Chart options={options} series={[{ name: 'Aircraft', data: series }]} type="bar" height={height} />
  );
}

export function ApexDonut({ labels, series, height = 200, onSelect, centerLabel }) {
  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'Lexend Deca, sans-serif',
      events: {
        dataPointSelection: (_e, _ctx, cfg) => {
          const label = labels[cfg.dataPointIndex];
          if (label && onSelect) onSelect(label);
        },
      },
    },
    labels,
    colors: [BRAND.crimson, BRAND.saffron, BRAND.deep],
    legend: { position: 'right', fontSize: '12px', fontWeight: 500, labels: { colors: BRAND.ink } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            name: { show: true, fontSize: '11px', color: BRAND.muted },
            value: { show: true, fontSize: '22px', fontWeight: 700, color: BRAND.deep },
            total: {
              show: true,
              label: centerLabel || 'Total',
              fontSize: '11px',
              color: BRAND.muted,
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
            },
          },
        },
      },
    },
    stroke: { width: 2, colors: ['#fff'] },
    tooltip: { y: { formatter: (v) => `${v} aircraft` } },
  };

  return <Chart options={options} series={series} type="donut" height={height} />;
}

export function ApexAreaDual({ categories, revenue, budget, height = 120 }) {
  const options = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Lexend Deca, sans-serif',
      sparkline: { enabled: height < 140 },
    },
    colors: [BRAND.crimson, BRAND.deep],
    stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 5] },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { show: height >= 140, style: { colors: BRAND.muted, fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: height >= 140, labels: { style: { colors: BRAND.muted, fontSize: '10px' } } },
    grid: { show: height >= 140, borderColor: BRAND.line, strokeDashArray: 4 },
    legend: { show: height >= 140, position: 'top', horizontalAlign: 'right' },
    tooltip: {
      shared: true,
      y: { formatter: (v) => `$${v}M` },
    },
  };

  return (
    <Chart
      options={options}
      series={[
        { name: 'Revenue', data: revenue },
        { name: 'Budget', data: budget },
      ]}
      type="area"
      height={height}
    />
  );
}

export function ApexRadial({ value, label, height = 200 }) {
  const options = {
    chart: { type: 'radialBar', fontFamily: 'Lexend Deca, sans-serif' },
    plotOptions: {
      radialBar: {
        hollow: { size: '62%' },
        track: { background: '#f0f0f0' },
        dataLabels: {
          name: { fontSize: '12px', color: BRAND.muted, offsetY: 18 },
          value: {
            fontSize: '28px',
            fontWeight: 700,
            color: BRAND.deep,
            offsetY: -12,
            formatter: (v) => `${v}%`,
          },
        },
      },
    },
    colors: [BRAND.crimson],
    labels: [label],
  };
  return <Chart options={options} series={[value]} type="radialBar" height={height} />;
}

export function ApexGroupedBar({ categories, series, height = 260 }) {
  const options = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Lexend Deca, sans-serif' },
    plotOptions: { bar: { borderRadius: 5, columnWidth: '55%' } },
    colors: [BRAND.crimson, BRAND.deep],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { style: { colors: BRAND.muted, fontSize: '11px' } },
    },
    yaxis: { labels: { style: { colors: BRAND.muted, fontSize: '11px' } } },
    grid: { borderColor: BRAND.line, strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right' },
    tooltip: { theme: 'light' },
  };
  return <Chart options={options} series={series} type="bar" height={height} />;
}

export function ApexHeatmap({ series, height = 240 }) {
  const options = {
    chart: { type: 'heatmap', toolbar: { show: false }, fontFamily: 'Lexend Deca, sans-serif' },
    dataLabels: { enabled: true, style: { colors: ['#272727'], fontSize: '10px' } },
    colors: [BRAND.crimson],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 2, color: '#FFE5EE', name: 'low' },
            { from: 3, to: 6, color: '#FF8AB0', name: 'mid' },
            { from: 7, to: 50, color: BRAND.crimson, name: 'high' },
          ],
        },
      },
    },
    xaxis: { labels: { style: { colors: BRAND.muted, fontSize: '10px' } } },
    yaxis: { labels: { style: { colors: BRAND.ink, fontSize: '11px', fontWeight: 600 } } },
    legend: { show: false },
  };
  return <Chart options={options} series={series} type="heatmap" height={height} />;
}
