'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartData {
  name: string;
  value: number;
  code?: string;
  full_name?: string;
}

interface BarChartProps {
  data: BarChartData[];
  dataKey?: string;
  yAxisDomain?: [number, number];
  barColor?: string;
  height?: number;
}

export function BarChartComponent({
  data,
  dataKey = 'value',
  yAxisDomain = [0, 5],
  barColor = '#7C3AED',
  height = 320,
}: BarChartProps) {
  if (!data || data.length === 0) return null;

  const COLORS = ['#7C3AED', '#EC4899', '#2563EB', '#8B5CF6', '#F43F5E', '#3B82F6', '#6366F1'];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: 12 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            stroke="#CBD5E1"
          />
          <YAxis
            domain={yAxisDomain}
            tick={{ fill: '#64748B', fontSize: 12 }}
            stroke="#CBD5E1"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(val: number) => [`${val.toFixed(2)}`, 'Nilai / Skor']}
          />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} maxBarSize={50}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
