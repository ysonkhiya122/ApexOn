import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addPoints, markQuizCompleted } from '../../../store/slices/fanProfileSlice';
import { Button } from '../../../components/atoms/button';
import { Gamepad2, CheckCircle2, Award, Zap } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './games.scss';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

export const GamesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const completedQuizzes = useSelector((state: RootState) => state.fanProfile.completedQuizzes);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: 'Which driver has won the most World Championships?',
      options: ['Lewis Hamilton', 'Sebastian Vettel', 'Max Verstappen', 'Fernando Alonso'],
      correct: 0,
    },
    {
      id: 2,
      text: 'How many teams usually participate on an F1 grid?',
      options: ['8 Teams', '10 Teams', '12 Teams', '15 Teams'],
      correct: 1,
    },
    {
      id: 3,
      text: 'What does a yellow flag typically indicate?',
      options: ['Full Speed', 'Pitlane Open', 'Danger / Slow Down', 'Race Canceled'],
      correct: 2,
    },
  ];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleConfirm = () => {
    if (selectedOpt === null) return;
    setIsAnswered(true);
    if (selectedOpt === questions[currentIdx].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizDone(true);
      dispatch(addPoints(score * 50));
      dispatch(markQuizCompleted('trivia_1'));
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizDone(false);
  };

  const isAlreadyTaken = completedQuizzes.includes('trivia_1');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 text-slate-100 space-y-8 pb-16">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Gamepad2 className="text-red-500 flex-shrink-0" size={32} />
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">{t('games.arcade')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('games.arcade_subtitle')}</p>
        </div>
      </div>

      {isAlreadyTaken && !quizDone && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3 text-sm text-emerald-400">
          <CheckCircle2 className="flex-shrink-0" size={18} />
          <span>{t('games.already_completed')}</span>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 bg-red-600/10 blur-2xl rounded-full" />

        {quizDone ? (
          <div className="text-center py-6 space-y-4">
            <Award className="text-yellow-500 mx-auto" size={48} />
            <h2 className="text-2xl font-black text-slate-100">{t('games.completed_title')}</h2>
            <p className="text-slate-400">
              {t('games.scored')} <span className="text-red-500 font-extrabold font-mono text-xl">{score}</span> {t('games.of')}{' '}
              {questions.length}.
            </p>
            <div className="font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <Zap size={16} /> +{score * 50} {t('games.xp_added')}
            </div>
            <Button onClick={restartQuiz} variant="primary" className="mt-4">
              {t('games.try_again')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold tracking-wider">
              <span>{t('games.trivia_event')}</span>
              <span>
                {t('games.question')} {currentIdx + 1} {t('games.of')} {questions.length}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-100">{questions[currentIdx].text}</h2>

            <div className="grid grid-cols-1 gap-3">
              {questions[currentIdx].options.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                const isCorrect = oIdx === questions[currentIdx].correct;

                let btnStyle = 'border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-slate-300';
                if (isSelected) {
                  btnStyle = 'border-red-600 bg-slate-900 text-red-400 font-semibold';
                }
                if (isAnswered) {
                  if (isCorrect) btnStyle = 'border-emerald-600 bg-emerald-950/20 text-emerald-400 font-bold';
                  else if (isSelected) btnStyle = 'border-rose-600 bg-rose-950/20 text-rose-400';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(oIdx)}
                    disabled={isAnswered}
                    className={`w-full flex items-center justify-between rounded-lg border p-4 text-left text-sm transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              {!isAnswered ? (
                <Button onClick={handleConfirm} disabled={selectedOpt === null} variant="primary">
                  {t('games.confirm')}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="secondary">
                  {currentIdx === questions.length - 1 ? t('games.finish') : t('games.next')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
