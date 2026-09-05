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
    'bg-[#161210] border border-[#3A2E24] p-3 text-[#F1E7D6] rounded-sm';
  const labelClass = 'block text-xs uppercase tracking-[0.06em] font-medium text-[#8C7F6E] mb-1.5';

  return (
    <div className="text-[#F1E7D6]">
      <h2 className="font-display text-xl font-medium tracking-[-0.005em] mb-5">
        {t('personalInfo')}
      </h2>

      <div className="space-y-5">
        {/* Email, not editable */}
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
                className="flex-grow p-3 border border-[#3A2E24] rounded-sm bg-[#1E1813] text-[#F1E7D6] focus:outline-none focus:border-[#F3C56B] focus:ring-2 focus:ring-[#F3C56B]/25 transition-colors disabled:opacity-60"
                disabled={loading}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-[#E0A83A] text-[#161210] font-semibold text-sm rounded-sm hover:bg-[#F3C56B] hover:text-[#161210] transition-colors disabled:opacity-60"
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
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] font-medium text-sm rounded-sm hover:border-[#F3C56B] hover:bg-[#161210] transition-colors disabled:opacity-60"
                  disabled={loading}
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className={`${readonlyField} flex-grow`}>
                {fullName || <span className="text-[#8C7F6E]">{t('notProvided')}</span>}
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center min-h-[44px] px-3 text-sm font-medium text-[#F3C56B] hover:text-[#F3C56B] transition-colors"
                disabled={loading}
              >
                {t('edit')}
              </button>
            </div>
          )}
        </div>

        {/* Información de la cuenta */}
        <div>
          <h3 className="font-display text-base font-medium text-[#F1E7D6] tracking-[-0.005em] mb-2">
            {t('accountInfo')}
          </h3>
          <div className="bg-[#161210] border border-[#3A2E24] p-4 rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.06em] text-[#8C7F6E] mb-0.5">
                  {t('accountCreated')}
                </p>
                <p className="font-medium text-[#F1E7D6]">{createdAt || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.06em] text-[#8C7F6E] mb-0.5">
                  {t('accountId')}
                </p>
                <p className="font-medium text-[#C9BBA5] text-sm truncate tabular-nums">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
