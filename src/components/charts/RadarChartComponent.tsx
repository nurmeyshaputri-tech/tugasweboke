'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export interface RadarChartItem {
  subject: string; // Variable Name
  [key: string]: any; // Candidate names -> score
}

interface RadarChartProps {
  data: RadarChartItem[];
  candidates: string[]; // List of Candidate Names
  height?: number;
}

const COLORS = ['#7C3AED', '#EC4899', '#2563EB', '#10B981', '#F59E0B', '#6366F1'];

export function RadarChartComponent({ data, candidates, height = 360 }: RadarChartProps) {
  if (!data || data.length === 0 || candidates.length === 0) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#CBD5E1" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E2E8F0',
              borderRadius: '12px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {candidates.map((cand, idx) => (
            <Radar
              key={cand}
              name={cand}
              dataKey={cand}
              stroke={COLORS[idx % COLORS.length]}
              fill={COLORS[idx % COLORS.length]}
              fillOpacity={0.25}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
