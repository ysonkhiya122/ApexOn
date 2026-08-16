import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setPreloaderVisible } from '../../../store/slices/uiSlice';
import './preloader.scss';

const LIGHT_COUNT = 5;
const LIGHT_INTERVAL_MS = 320;
const HOLD_AFTER_LIGHTS_MS = 500;
const FADE_MS = 500;
const SESSION_KEY = 'apexon_seen_preloader';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const alreadySeenThisSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

export const Preloader: React.FC = () => {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.ui.preloaderVisible);

  const [lightsCount, setLightsCount] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(visible);
  const wasVisible = useRef(visible);

  // Skip the whole sequence for repeat navigations in the same session and for
  // users who have asked for reduced motion — a start-light show is charming
  // once, not on every page load.
  useEffect(() => {
    if (visible && (alreadySeenThisSession() || prefersReducedMotion())) {
      dispatch(setPreloaderVisible(false));
      setIsMounted(false);
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setLightsCount((prev) => {
        if (prev >= LIGHT_COUNT) return prev;
        return prev + 1;
      });
    }, LIGHT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible || lightsCount < LIGHT_COUNT) return;

    const timeout = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* storage unavailable — non-fatal */
      }
      dispatch(setPreloaderVisible(false));
    }, HOLD_AFTER_LIGHTS_MS);

    return () => clearTimeout(timeout);
  }, [visible, lightsCount, dispatch]);

  // CSS-driven exit: keep the node mounted for one fade, then drop it.
  useEffect(() => {
    if (wasVisible.current && !visible) {
      setIsFadingOut(true);
      const timeout = setTimeout(() => {
        setIsFadingOut(false);
        setIsMounted(false);
      }, FADE_MS);
      wasVisible.current = visible;
      return () => clearTimeout(timeout);
    }

    wasVisible.current = visible;
    if (visible) setIsMounted(true);
  }, [visible]);

  if (!isMounted) return null;

  const lightsOut = lightsCount >= LIGHT_COUNT;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Apexon"
      className={`f1-preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white ${
        isFadingOut ? 'f1-preloader--exit' : ''
      }`}
    >
      <div className="mb-12 flex items-center justify-center gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl">
        {Array.from({ length: LIGHT_COUNT }).map((_, idx) => {
          const isOn = idx < lightsCount;
          const lightClass = `h-6 w-6 rounded-full transition-all duration-300 ${
            isOn ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'bg-slate-900'
          }`;
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-1 rounded border border-slate-700 bg-slate-800 p-2 shadow-inner">
                <div className={lightClass} />
                <div className={lightClass} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-black uppercase tracking-widest text-red-500">Apexon</h1>
        <p className="mt-2 text-sm font-medium tracking-widest text-slate-400">
          {lightsOut ? 'LIGHTS OUT AND AWAY WE GO!' : 'PREPARING ENGINE...'}
        </p>
      </div>
    </div>
  );
};
