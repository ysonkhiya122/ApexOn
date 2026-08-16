import { motion } from 'framer-motion'
import { Plus, Minus, RotateCcw } from 'lucide-react'
import { increment, decrement, reset } from '../store/slices/counterSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { cn } from '../utils/cn'

export function Counter() {
  const dispatch = useAppDispatch()
  const count = useAppSelector((state) => state.counter?.value || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg shadow-2xl max-w-sm"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Counter Example</h2>

      <motion.div
        key={count}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-6xl font-bold text-blue-400 mb-8 min-w-32 text-center"
      >
        {count}
      </motion.div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => dispatch(decrement())}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
            'bg-red-600 hover:bg-red-700 text-white transition-colors'
          )}
        >
          <Minus size={20} />
          Decrease
        </button>

        <button
          onClick={() => dispatch(increment())}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
            'bg-green-600 hover:bg-green-700 text-white transition-colors'
          )}
        >
          <Plus size={20} />
          Increase
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => dispatch(reset())}
        className={cn(
          'flex items-center gap-2 px-6 py-2 rounded-lg font-medium',
          'bg-slate-600 hover:bg-slate-700 text-white transition-colors'
        )}
      >
        <RotateCcw size={20} />
        Reset
      </motion.button>
    </motion.div>
  )
}
