import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../shared/components/atoms/button';
import './auth.scss';

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const validateForm = () => {
    if (!email || !password) {
      setValidationError(t('auth.validation.required'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError(t('auth.validation.email'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) return;

    dispatch(loginStart());

    // MOCK LOGIN - Replace with actual API call in production
    setTimeout(() => {
      if (email === 'demo@apexon.com' && password === 'demo123') {
        dispatch(
          loginSuccess({
            user: {
              id: '1',
              email,
              name: 'Demo User',
              avatar: undefined,
            },
            token: 'mock-jwt-token-' + Date.now(),
          })
        );
        navigate(from, { replace: true });
      } else {
        dispatch(loginFailure(t('auth.errors.invalid_credentials')));
      }
    }, 1000);
  };

  return (
    <div className="auth-form">
      <div className="auth-form__card">
        <div className="auth-form__header">
          <h1 className="auth-form__title">{t('auth.login.title')}</h1>
          <p className="auth-form__subtitle">{t('auth.login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form__form">
          <div className="auth-form__field">
            <label className="auth-form__label">{t('auth.login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-form__input"
              placeholder="demo@apexon.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label">{t('auth.login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-form__input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {validationError && (
            <div className="auth-form__error">{validationError}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="auth-form__submit"
            isLoading={false}
          >
            {t('auth.login.submit')}
          </Button>

          <div className="auth-form__footer">
            <Link to="/forgot-password" className="auth-form__link">
              {t('auth.login.forgot')}
            </Link>
            <Link to="/register" className="auth-form__link">
              {t('auth.login.register')}
            </Link>
          </div>

          <div className="auth-form__demo-notice">
            <p>Demo credentials: demo@apexon.com / demo123</p>
          </div>
        </form>
      </div>
    </div>
  );
};
