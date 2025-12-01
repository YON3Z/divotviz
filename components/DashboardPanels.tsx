import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell
} from 'recharts';
import { ChartDataPoint, LeakageDataPoint } from '../types';

// --- Panel B Data ---
const correlationData: ChartDataPoint[] = [
  { name: 0.0, value: 0.951 },
  { name: 0.2, value: 0.999 },
  { name: 0.5, value: 1.007 },
  { name: 0.8, value: 0.993 },
  { name: 1.0, value: 0.960 },
];

// --- Panel C Data ---
const leakageData: LeakageDataPoint[] = [
  { leakage: 0.0, clusters: 8, color: '#22c55e' }, // Green
  { leakage: 0.1, clusters: 2, color: '#ef4444' }, // Red
  { leakage: 0.25, clusters: 2, color: '#ef4444' }, // Red
  { leakage: 0.5, clusters: 6, color: '#f97316' }, // Orange
  { leakage: 0.75, clusters: 8, color: '#f97316' }, // Orange
  { leakage: 1.0, clusters: 6, color: '#94a3b8' }, // Grey
];

export const CorrelationChart: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={correlationData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            label={{ value: 'Strength', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10 }} 
          />
          <YAxis stroke="#94a3b8" domain={[0.94, 1.02]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
            itemStyle={{ color: '#e879f9' }}
            formatter={(value: number) => [value, "Org Index"]}
            labelFormatter={(label) => `Correlation: ${label}`}
          />
          <ReferenceLine x={0.5} stroke="white" strokeDasharray="3 3" label={{ value: "Optimal", fill: "white", fontSize: 10 }} />
          <Line type="monotone" dataKey="value" stroke="#e879f9" strokeWidth={3} dot={{ r: 4, fill: '#e879f9' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LeakageChart: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={leakageData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="leakage" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
             cursor={{fill: 'rgba(255,255,255,0.05)'}}
             contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
          />
          <Bar dataKey="clusters" radius={[4, 4, 0, 0]}>
            {leakageData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};