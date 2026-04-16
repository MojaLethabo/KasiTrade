"use client";

interface DataPoint {
  label: string;
  income: number;
  expenses: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
}

export default function LineChart({ data, height = 200 }: LineChartProps) {
  if (!data.length) return null;

  const W = 600;
  const H = height;
  const PAD = { top: 20, right: 20, bottom: 32, left: 56 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = data.flatMap(d => [d.income, d.expenses]);
  const maxVal = Math.max(...allValues, 1);
  const minVal = 0;

  function xPos(i: number) {
    return PAD.left + (i / (data.length - 1)) * chartW;
  }
  function yPos(v: number) {
    return PAD.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
  }

  function buildPath(values: number[]) {
    return values.map((v, i) => `${i === 0 ? "M" : "L"} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(" ");
  }

  function buildArea(values: number[]) {
    const line = buildPath(values);
    const lastX = xPos(values.length - 1).toFixed(1);
    const firstX = xPos(0).toFixed(1);
    const baseY = (PAD.top + chartH).toFixed(1);
    return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }

  // Y axis ticks
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (maxVal / tickCount) * i);

  function fmtTick(v: number) {
    if (v >= 1000) return `R${(v / 1000).toFixed(0)}k`;
    return `R${v.toFixed(0)}`;
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: "320px", display: "block" }}
        aria-label="Income and expenses line chart"
      >
        {/* Grid lines */}
        {ticks.map((tick, i) => {
          const y = yPos(tick);
          return (
            <g key={i}>
              <line
                x1={PAD.left} y1={y}
                x2={PAD.left + chartW} y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8} y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="rgba(255,255,255,0.3)"
              >
                {fmtTick(tick)}
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xPos(i)} y={H - 6}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.35)"
          >
            {d.label}
          </text>
        ))}

        {/* Area fills */}
        <path
          d={buildArea(data.map(d => d.income))}
          fill="rgba(255,255,255,0.04)"
        />
        <path
          d={buildArea(data.map(d => d.expenses))}
          fill="rgba(255,80,80,0.04)"
        />

        {/* Expense line */}
        <path
          d={buildPath(data.map(d => d.expenses))}
          fill="none"
          stroke="rgba(255,100,100,0.55)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* Income line */}
        <path
          d={buildPath(data.map(d => d.income))}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots — income */}
        {data.map((d, i) => (
          <g key={`dot-inc-${i}`}>
            <circle
              cx={xPos(i)} cy={yPos(d.income)}
              r="4"
              fill="var(--bg-2)"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1.5"
            />
            {/* Tooltip on hover via title */}
            <title>{d.label} Income: R{d.income.toLocaleString("en-ZA")}</title>
          </g>
        ))}

        {/* Dots — expenses */}
        {data.map((d, i) => (
          <g key={`dot-exp-${i}`}>
            <circle
              cx={xPos(i)} cy={yPos(d.expenses)}
              r="3"
              fill="var(--bg-2)"
              stroke="rgba(255,100,100,0.55)"
              strokeWidth="1.5"
            />
            <title>{d.label} Expenses: R{d.expenses.toLocaleString("en-ZA")}</title>
          </g>
        ))}

        {/* Legend */}
        <g>
          <circle cx={PAD.left + 4} cy={PAD.top - 6} r="4" fill="rgba(255,255,255,0.8)" />
          <text x={PAD.left + 13} y={PAD.top - 2} fontSize="10" fill="rgba(255,255,255,0.5)">Income</text>
          <circle cx={PAD.left + 70} cy={PAD.top - 6} r="3" fill="rgba(255,100,100,0.55)" />
          <text x={PAD.left + 79} y={PAD.top - 2} fontSize="10" fill="rgba(255,255,255,0.5)">Expenses</text>
        </g>
      </svg>
    </div>
  );
}
