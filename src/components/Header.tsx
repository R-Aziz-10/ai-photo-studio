import type { TrackingStatus } from '../hooks/useFaceTracking';
import { DEMO_MODE } from '../config/constants';

type Props = { fps: number; status: TrackingStatus };

function StatusBadge({ status }: { status: TrackingStatus }) {
  switch (status) {
    case 'locked':
      return (
        <span className="text-emerald-400 flex items-center gap-1 font-medium">
          <i className="fa-solid fa-circle-check"></i> Locked
        </span>
      );
    case 'searching':
      return (
        <span className="text-amber-400 flex items-center gap-1">
          <i className="fa-solid fa-triangle-exclamation"></i> Searching
        </span>
      );
    case 'error':
      return (
        <span className="text-rose-400 flex items-center gap-1">
          <i className="fa-solid fa-circle-xmark"></i> Tracker Error
        </span>
      );
    case 'initializing':
      return (
        <span className="text-amber-400 flex items-center gap-1">
          <i className="fa-solid fa-circle-dot text-[10px] animate-pulse"></i> Initializing
        </span>
      );
    default:
      return (
        <span className="text-slate-500 flex items-center gap-1">
          <i className="fa-solid fa-circle-dot text-[10px]"></i> Camera Off
        </span>
      );
  }
}

export default function Header({ fps, status }: Props) {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyber-purple to-cyber-pink flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI PHOTO STUDIO
            </h1>
            <p className="text-xs text-slate-400">Real-time AR & Generative AI</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1">
            <span className="font-mono text-cyber-neon font-semibold">{fps} FPS</span>
            <span className="text-slate-500">|</span>
            <StatusBadge status={status} />
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1">
            <span className="text-slate-400">AI:</span>
            <span className={`${DEMO_MODE ? 'text-amber-400' : 'text-emerald-400'} font-semibold flex items-center gap-1.5`}>
              <span className={`w-2 h-2 rounded-full ${DEMO_MODE ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
              {DEMO_MODE ? 'Mode Demo' : 'FLUX.2 Cloudflare'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
