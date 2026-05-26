import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setPreloaderVisible } from '../../../store/slices/uiSlice';
import './preloader.scss';

export const Preloader: React.FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state: RootState) => state.ui.preloaderVisible);
  const [lightsCount, setLightsCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setLightsCount((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setTimeout(() => {
            dispatch(setPreloaderVisible(false));
          }, 1000);
          return 5;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [visible, dispatch]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="f1-preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
        >
          <div className="mb-12 flex items-center justify-center gap-6 rounded-xl bg-slate-900/50 p-6 border border-slate-800 shadow-2xl">
            {Array.from({ length: 5 }).map((_, idx) => {
              const isOn = idx < lightsCount;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="flex flex-col gap-1 rounded bg-slate-800 p-2 border border-slate-700 shadow-inner">
                    <div
                      className={`h-6 w-6 rounded-full transition-all duration-300 ${
                        isOn ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'bg-slate-900'
                      }`}
                    />
                    <div
                      className={`h-6 w-6 rounded-full transition-all duration-300 ${
                        isOn ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'bg-slate-900'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-black tracking-widest text-red-500 uppercase">
              Apexon
            </h1>
            <p className="mt-2 text-sm tracking-widest text-slate-400 font-medium">
              {lightsCount < 5 ? 'PREPARING ENGINE...' : 'LIGHTS OUT AND AWAY WE GO!'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
