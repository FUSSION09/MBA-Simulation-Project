'use client';

import React, { useId } from 'react';
import { Cpu, Gauge, Zap } from 'lucide-react';

interface FactoryApparatus3DProps {
  plantCapacity: number;
  totalProduction: number;
  automationLevel: number; // 1 to 10
}

/**
 * Interactive 3D Isometric Apparatus built following the Anatomy skill specifications:
 * - Real physical instrument: Heavy cast base, dual guide rails with tick rules,
 *   movable gantry carriage, robotics automation arm, and a dial indicator with live needle.
 * - Exact isometric projection (30° elevation) with 4-tone shading.
 * - Reactive state: Carriage position reflects production, needle reflects utilization %,
 *   robotics arm and LED status reflect automation level.
 */
export const FactoryApparatus3D: React.FC<FactoryApparatus3DProps> = ({
  plantCapacity,
  totalProduction,
  automationLevel,
}) => {
  const gradientId = useId();

  // Utilization calculation
  const utilization = plantCapacity > 0 ? (totalProduction / plantCapacity) * 100 : 0;
  const isOvertime = utilization > 100;

  // Normalized carriage travel: 0 (rest) to 1 (full capacity or overtime)
  const travelNorm = Math.min(1.2, Math.max(0, utilization / 100));

  // Isometric projection helper
  // x: along rail, y: across rail, z: height
  const toIso = (x: number, y: number, z: number) => {
    const cos30 = 0.866025;
    const sin30 = 0.5;
    const px = 250 + (x - y) * cos30;
    const py = 190 + (x + y) * sin30 - z;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  };

  // Dial needle angle in degrees (-120° to +120°)
  // -120° is 0%, 0° is 100%, +60° is 120% overtime
  const needleAngle = Math.min(130, Math.max(-130, -120 + (utilization / 100) * 120));

  // Carriage travel coordinate (along X axis from -90 to +90)
  const carriageX = -85 + travelNorm * 140;

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 sm:p-5 shadow-sm overflow-hidden">
      {/* Instrument Frame Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] text-blue-400 bg-blue-950/70 border border-blue-800/80 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
            Fig. 1 • Operations Physical Instrument
          </span>
          <span className="font-semibold text-xs text-slate-200">
            Modular Automated Assembly Rig
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Robotics: <strong className="text-slate-200">Lvl {automationLevel}/10</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            <span>Plant Load: <strong className={isOvertime ? 'text-amber-400' : 'text-emerald-400'}>{utilization.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Isometric SVG Canvas */}
      <div className="relative w-full aspect-[2/1] max-h-[260px] flex items-center justify-center">
        <svg
          viewBox="0 0 500 250"
          className="w-full h-full select-none"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Shading Gradients for cylindrical rails */}
            <linearGradient id={`${gradientId}-steel`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#f1f5f9" />
              <stop offset="80%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id={`${gradientId}-brass`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>

            <linearGradient id={`${gradientId}-dialFace`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* 1. Base Plate (Heavy Cast Foundation) */}
          {/* Top Face */}
          <polygon
            points={`${toIso(-120, -60, 0)} ${toIso(120, -60, 0)} ${toIso(120, 60, 0)} ${toIso(-120, 60, 0)}`}
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Front Left Face */}
          <polygon
            points={`${toIso(-120, 60, 0)} ${toIso(120, 60, 0)} ${toIso(120, 60, -14)} ${toIso(-120, 60, -14)}`}
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Front Right Face */}
          <polygon
            points={`${toIso(120, -60, 0)} ${toIso(120, 60, 0)} ${toIso(120, 60, -14)} ${toIso(120, -60, -14)}`}
            fill="#131d31"
            stroke="#1e293b"
            strokeWidth="1.2"
          />

          {/* Precision Ruler Ticks along front rail edge */}
          {[-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100].map((tx) => (
            <line
              key={tx}
              x1={toIso(tx, 45, 0).split(',')[0]}
              y1={toIso(tx, 45, 0).split(',')[1]}
              x2={toIso(tx, 49, 0).split(',')[0]}
              y2={toIso(tx, 49, 0).split(',')[1]}
              stroke="#475569"
              strokeWidth="1"
            />
          ))}

          {/* Corner Foundation Feet with Hex Bolts */}
          {[
            [-110, -50],
            [110, -50],
            [-110, 50],
            [110, 50],
          ].map(([bx, by], idx) => {
            const [cx, cy] = toIso(bx, by, 0).split(',').map(Number);
            return (
              <g key={idx}>
                <ellipse cx={cx} cy={cy} rx="4.5" ry="2.6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <circle cx={cx} cy={cy - 0.5} r="1.5" fill="#64748b" />
              </g>
            );
          })}

          {/* 2. Dual Polished Steel Guide Rails */}
          {/* Rail 1 (Back Rail at Y = -25, Z = 8) */}
          <line
            x1={toIso(-105, -25, 8).split(',')[0]}
            y1={toIso(-105, -25, 8).split(',')[1]}
            x2={toIso(105, -25, 8).split(',')[0]}
            y2={toIso(105, -25, 8).split(',')[1]}
            stroke={`url(#${gradientId}-steel)`}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Rail 2 (Front Rail at Y = 25, Z = 8) */}
          <line
            x1={toIso(-105, 25, 8).split(',')[0]}
            y1={toIso(-105, 25, 8).split(',')[1]}
            x2={toIso(105, 25, 8).split(',')[0]}
            y2={toIso(105, 25, 8).split(',')[1]}
            stroke={`url(#${gradientId}-steel)`}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Rail End Support Blocks */}
          {[-105, 105].map((sx, idx) => (
            <g key={idx}>
              <polygon
                points={`${toIso(sx - 5, -32, 12)} ${toIso(sx + 5, -32, 12)} ${toIso(sx + 5, 32, 12)} ${toIso(sx - 5, 32, 12)}`}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1"
              />
              <polygon
                points={`${toIso(sx - 5, 32, 12)} ${toIso(sx + 5, 32, 12)} ${toIso(sx + 5, 32, 0)} ${toIso(sx - 5, 32, 0)}`}
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* 3. Mobile Gantry Carriage (Moves proportionally with Production Load) */}
          <g style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            {/* Carriage Base Block */}
            <polygon
              points={`${toIso(carriageX - 22, -35, 18)} ${toIso(carriageX + 22, -35, 18)} ${toIso(carriageX + 22, 35, 18)} ${toIso(carriageX - 22, 35, 18)}`}
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth="1.2"
            />
            {/* Carriage Front Edge */}
            <polygon
              points={`${toIso(carriageX - 22, 35, 18)} ${toIso(carriageX + 22, 35, 18)} ${toIso(carriageX + 22, 35, 6)} ${toIso(carriageX - 22, 35, 6)}`}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* Carriage Side Edge */}
            <polygon
              points={`${toIso(carriageX + 22, -35, 18)} ${toIso(carriageX + 22, 35, 18)} ${toIso(carriageX + 22, 35, 6)} ${toIso(carriageX + 22, -35, 6)}`}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Linear Ball Bushings */}
            {[-18, 18].map((bx, bidx) => (
              <g key={bidx}>
                <circle
                  cx={toIso(carriageX + bx, 25, 8).split(',')[0]}
                  cy={toIso(carriageX + bx, 25, 8).split(',')[1]}
                  r="3.5"
                  fill={`url(#${gradientId}-brass)`}
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <circle
                  cx={toIso(carriageX + bx, -25, 8).split(',')[0]}
                  cy={toIso(carriageX + bx, -25, 8).split(',')[1]}
                  r="3.5"
                  fill={`url(#${gradientId}-brass)`}
                  stroke="#334155"
                  strokeWidth="0.8"
                />
              </g>
            ))}

            {/* 4. Robotic Articulation Arm (Reflects Automation Level 1-10) */}
            {/* Base Turret */}
            <ellipse
              cx={toIso(carriageX, -8, 20).split(',')[0]}
              cy={toIso(carriageX, -8, 20).split(',')[1]}
              rx="9"
              ry="5"
              fill="#090d16"
              stroke="#3b82f6"
              strokeWidth="1"
            />

            {/* Articulated Segment 1 */}
            <line
              x1={toIso(carriageX, -8, 20).split(',')[0]}
              y1={toIso(carriageX, -8, 20).split(',')[1]}
              x2={toIso(carriageX + (automationLevel - 5) * 1.5, -8, 48).split(',')[0]}
              y2={toIso(carriageX + (automationLevel - 5) * 1.5, -8, 48).split(',')[1]}
              stroke="#3b82f6"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Elbow Joint */}
            <circle
              cx={toIso(carriageX + (automationLevel - 5) * 1.5, -8, 48).split(',')[0]}
              cy={toIso(carriageX + (automationLevel - 5) * 1.5, -8, 48).split(',')[1]}
              r="4"
              fill={`url(#${gradientId}-brass)`}
              stroke="#1e293b"
              strokeWidth="1"
            />

            {/* Articulated Segment 2 (Tool head) */}
            <line
              x1={toIso(carriageX + (automationLevel - 5) * 1.5, -8, 48).split(',')[0]}
              y1={toIso(carriageX + (automationLevel - 5) * 1.5, -8, 48).split(',')[1]}
              x2={toIso(carriageX + 10, 10, 32).split(',')[0]}
              y2={toIso(carriageX + 10, 10, 32).split(',')[1]}
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Tool Laser Emitter / Tooltip */}
            <circle
              cx={toIso(carriageX + 10, 10, 32).split(',')[0]}
              cy={toIso(carriageX + 10, 10, 32).split(',')[1]}
              r="2"
              fill={automationLevel > 5 ? '#22c55e' : '#3b82f6'}
              stroke="#ffffff"
              strokeWidth="0.8"
            />

            {/* Optical Laser Beam projection when active */}
            {automationLevel >= 3 && (
              <line
                x1={toIso(carriageX + 10, 10, 32).split(',')[0]}
                y1={toIso(carriageX + 10, 10, 32).split(',')[1]}
                x2={toIso(carriageX + 10, 10, 8).split(',')[0]}
                y2={toIso(carriageX + 10, 10, 8).split(',')[1]}
                stroke={isOvertime ? '#f59e0b' : '#22c55e'}
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.8"
              />
            )}
          </g>

          {/* 5. Precision Dial Gauge Indicator (Instrument Station at X=85, Y=-45, Z=45) */}
          {/* Gauge Support Post */}
          <line
            x1={toIso(85, -45, 0).split(',')[0]}
            y1={toIso(85, -45, 0).split(',')[1]}
            x2={toIso(85, -45, 35).split(',')[0]}
            y2={toIso(85, -45, 35).split(',')[1]}
            stroke={`url(#${gradientId}-steel)`}
            strokeWidth="3.5"
          />

          {/* Dial Housing Bezel */}
          <g transform={`translate(${toIso(85, -45, 50).split(',')[0]}, ${toIso(85, -45, 50).split(',')[1]})`}>
            {/* Outer Brass Bezel */}
            <circle r="22" fill="#1e293b" stroke={`url(#${gradientId}-brass)`} strokeWidth="2.5" />
            {/* Inner Dark Face */}
            <circle r="19" fill={`url(#${gradientId}-dialFace)`} stroke="#334155" strokeWidth="1" />

            {/* Green, Amber, Red Sector Arcs */}
            <path d="M -13 8 A 15 15 0 0 1 0 -15" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
            <path d="M 0 -15 A 15 15 0 0 1 10 -11" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
            <path d="M 10 -11 A 15 15 0 0 1 15 0" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" />

            {/* Dial Center Pivot */}
            <circle r="2.5" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1" />

            {/* Rotating Needle */}
            <g style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.4s ease-out' }}>
              <line x1="0" y1="0" x2="0" y2="-15" stroke={isOvertime ? '#ef4444' : '#22c55e'} strokeWidth="1.8" strokeLinecap="round" />
              <polygon points="-1.5,0 1.5,0 0,-16" fill={isOvertime ? '#ef4444' : '#22c55e'} />
            </g>

            {/* Gauge Label */}
            <text y="9" textAnchor="middle" fill="#94a3b8" fontSize="5.5" fontFamily="sans-serif" fontWeight="bold">
              LOAD %
            </text>
          </g>

          {/* 6. Engraved Identification Badge on Foundation */}
          <g>
            <polygon
              points={`${toIso(-80, 56, 0)} ${toIso(-30, 56, 0)} ${toIso(-30, 56, -10)} ${toIso(-80, 56, -10)}`}
              fill={`url(#${gradientId}-brass)`}
              stroke="#854d0e"
              strokeWidth="0.8"
            />
            <text
              x={toIso(-55, 56, -6).split(',')[0]}
              y={toIso(-55, 56, -6).split(',')[1]}
              textAnchor="middle"
              fill="#0f172a"
              fontSize="4.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              MOD-718 • VER 2.4
            </text>
          </g>
        </svg>
      </div>

      {/* Live Readout & Legend Bar */}
      <div className="mt-2 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Optimal (0-100%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Overtime (&gt;100%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>Laser Tooling</span>
          </span>
        </div>

        <div className="font-mono text-slate-300">
          Scheduled: <strong className="text-white">{totalProduction.toLocaleString()}</strong> / {plantCapacity.toLocaleString()} units
        </div>
      </div>
    </div>
  );
};
