'use client';

import { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

type UserProfile = {
  id: string;
  full_name?: string | null;
  shipping_address?: unknown | null;
  preferences?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

type ProfileTabProps = {
  user: User;
  profile: UserProfile | null;
  updateFullName: (fullName: string) => Promise<void>;
  loading: boolean;
};

export default function ProfileTab({ user, profile, updateFullName, loading }: ProfileTabProps) {
  const t = useTranslations('Account');
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || user.user_metadata?.full_name || '');
  }, [profile?.full_name, user.user_metadata?.full_name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() === '') return;
    await updateFullName(fullName);
    setIsEditing(false);
  };

  const createdAt = useMemo(
    () => (user.created_at ? new Date(user.created_at).toLocaleDateString() : ''),
    [user.created_at]
  );

  const readonlyField =
    'bg-[#FAF8F5] border border-[#E8E4E0] p-3 text-[#2D2D2D] rounded-sm';
  const labelClass = 'block text-xs uppercase tracking-[0.06em] font-medium text-[#6B6459] mb-1.5';

  return (
    <div className="text-[#2D2D2D]">
      <h2 className="font-display text-xl font-medium tracking-[-0.005em] mb-5">
        {t('personalInfo')}
      </h2>

      <div className="space-y-5">
        {/* Email — no editable */}
        <div>
          <label className={labelClass} htmlFor="profile-email">
            {t('email')}
          </label>
          <div id="profile-email" className={readonlyField}>
            {user.email}
          </div>
        </div>

        {/* Nombre completo */}
        <div>
          <label htmlFor="fullName" className={labelClass}>
            {t('fullName')}
          </label>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-grow p-3 border border-[#E8E4E0] rounded-sm bg-white text-[#2D2D2D] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25 transition-colors disabled:opacity-60"
                disabled={loading}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-[#C9A962] text-[#1A1A1A] font-semibold text-sm rounded-sm hover:bg-[#A08848] hover:text-[#F5F1EB] transition-colors disabled:opacity-60"
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" strokeWidth={2} aria-hidden />
                  )}
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(profile?.full_name || user.user_metadata?.full_name || '');
                  }}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-white border border-[#E8E4E0] text-[#2D2D2D] font-medium text-sm rounded-sm hover:border-[#A08848] hover:bg-[#FAF8F5] transition-colors disabled:opacity-60"
                  disabled={loading}
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className={`${readonlyField} flex-grow`}>
                {fullName || <span className="text-[#9C9589]">{t('notProvided')}</span>}
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center min-h-[44px] px-3 text-sm font-medium text-[#A08848] hover:text-[#2D2D2D] transition-colors"
                disabled={loading}
              >
                {t('edit')}
              </button>
            </div>
          )}
        </div>

        {/* Información de la cuenta */}
        <div>
          <h3 className="font-display text-base font-medium text-[#2D2D2D] tracking-[-0.005em] mb-2">
            {t('accountInfo')}
          </h3>
          <div className="bg-[#FAF8F5] border border-[#E8E4E0] p-4 rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.06em] text-[#6B6459] mb-0.5">
                  {t('accountCreated')}
                </p>
                <p className="font-medium text-[#2D2D2D]">{createdAt || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.06em] text-[#6B6459] mb-0.5">
                  {t('accountId')}
                </p>
                <p className="font-medium text-[#4A4A4A] text-sm truncate tabular-nums">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
