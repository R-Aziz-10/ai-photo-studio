import type { TrackingStatus } from '../hooks/useFaceTracking';
import { DEMO_MODE } from '../config/constants';

type Props = { fps: number; status: TrackingStatus };

function StatusBadge({ status }: { status: TrackingStatus }) {
  switch (status) {
    case 'locked':
      return (
        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
          <i className="fa-solid fa-circle-check"></i> Locked
        </span>
      );
    case 'searching':
      return (
        <span className="text-amber-700 flex items-center gap-1 font-medium">
          <i className="fa-solid fa-triangle-exclamation"></i> Searching
        </span>
      );
    case 'error':
      return (
        <span className="text-rose-700 flex items-center gap-1 font-medium">
          <i className="fa-solid fa-circle-xmark"></i> Tracker Error
        </span>
      );
    case 'initializing':
      return (
        <span className="text-amber-700 flex items-center gap-1">
          <i className="fa-solid fa-circle-dot text-[10px] animate-pulse"></i> Initializing
        </span>
      );
    default:
      return (
        <span className="text-slate-600 flex items-center gap-1">
          <i className="fa-solid fa-circle-dot text-[10px]"></i> Camera Off
        </span>
      );
  }
}

export default function Header({ fps, status }: Props) {
  return (
    <header className="w-full px-4 pt-5 pb-2 flex flex-col items-center gap-3 text-center">
      <img src="/header-logo.png" alt="SMK Telkom Sidoarjo" className="h-24 w-auto max-w-full" />
      <h1 className="dtp-title">DTP AI</h1>
      <p className="font-display font-bold text-lg text-brand-600 bg-white rounded-full px-6 py-1 shadow-[0_4px_0_#bde6e8]">
        Dies Natalis ke-7 &middot; Photo Studio AI
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs mt-1">
        <div className="flex items-center space-x-2 bg-white/90 rounded-full px-3 py-1.5 shadow">
          <span className="font-mono text-brand-600 font-bold">{fps} FPS</span>
          <span className="text-slate-400">|</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center space-x-2 bg-white/90 rounded-full px-3 py-1.5 shadow">
          <span className="text-slate-600">AI:</span>
          <span className={`${DEMO_MODE ? 'text-amber-700' : 'text-emerald-700'} font-semibold flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${DEMO_MODE ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
            {DEMO_MODE ? 'Mode Demo' : 'FLUX.2 Cloudflare'}
          </span>
        </div>
      </div>
    </header>
  );
}
