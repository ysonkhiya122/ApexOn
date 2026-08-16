import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { registerStart, registerSuccess } from '../../store/slices/authSlice';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '@/components/atoms/button';
import './auth.scss';

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setValidationError(t('auth.validation.required'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError(t('auth.validation.email'));
      return false;
    }
    if (password.length < 8) {
      setValidationError(t('auth.validation.password_min'));
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError(t('auth.validation.password_match'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) return;

    dispatch(registerStart());

    // MOCK REGISTRATION - Replace with actual API call in production
    setTimeout(() => {
      dispatch(
        registerSuccess({
          user: {
            id: '1',
            email,
            name,
            avatar: undefined,
          },
          token: 'mock-jwt-token-' + Date.now(),
        })
      );
      navigate('/', { replace: true });
    }, 1000);
  };

  return (
    <div className="auth-form">
      <div className="auth-form__card">
        <div className="auth-form__header">
          <h1 className="auth-form__title">{t('auth.register.title')}</h1>
          <p className="auth-form__subtitle">{t('auth.register.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form__form">
          <div className="auth-form__field">
            <label className="auth-form__label">{t('auth.register.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-form__input"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label">{t('auth.register.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-form__input"
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label">{t('auth.register.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-form__input"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label">{t('auth.register.confirm')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-form__input"
              placeholder="••••••••"
              autoComplete="new-password"
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
            {t('auth.register.submit')}
          </Button>

          <div className="auth-form__footer">
            <Link to="/login" className="auth-form__link">
              {t('auth.register.login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
