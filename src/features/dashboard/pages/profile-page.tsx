import { useState } from 'react';
import { Building2, Copy, Mail, ShoppingCart, Trophy, User as UserIcon, Wallet } from 'lucide-react';
import { useProfile } from '../hooks/use-profile';
import { PROFILE_CONSTANTS } from '../constants/profile.constants';
import { type ProfileCompanyUser } from '../types/profile.types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatOrders = (count: number) =>
  count === 1 ? PROFILE_CONSTANTS.ranking.order : PROFILE_CONSTANTS.ranking.orders.replace('{count}', String(count));

const podiumStyles = [
  'bg-yellow-400/15 text-yellow-600',
  'bg-gray-400/15 text-gray-500',
  'bg-orange-400/15 text-orange-600',
];

export function ProfilePage() {
  const { profile, isLoading, error } = useProfile();
  const [copied, setCopied] = useState(false);

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    } finally {
      setTimeout(() => setCopied(false), 1000);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-3xl mx-auto relative pt-6 gap-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-gray-200 rounded-xl"></div>
          <div className="h-28 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col w-full max-w-3xl mx-auto relative pt-6">
        <div className="text-center py-8 text-text-secondary bg-white rounded-3xl border border-dashed border-gray-200">
          {error ?? PROFILE_CONSTANTS.error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto relative pt-6 gap-4">
      <div className="px-1">
        <h1 className="text-2xl font-bold text-text-primary">{PROFILE_CONSTANTS.page.title}</h1>
        <p className="text-text-secondary mt-1">{PROFILE_CONSTANTS.page.subtitle}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
          <UserIcon className="text-primary w-7 h-7" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-lg font-semibold text-text-primary truncate">{profile.name}</span>
          <span className="text-sm text-text-secondary flex items-center gap-1.5 min-w-0">
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <ShoppingCart className="w-4 h-4" />
            <p className="uppercase font-semibold text-xs">{PROFILE_CONSTANTS.metrics.orders}</p>
          </div>
          <p className="text-2xl font-semibold text-gray-800">{profile.quantityOfOrders}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Wallet className="w-4 h-4" />
            <p className="uppercase font-semibold text-xs">{PROFILE_CONSTANTS.metrics.revenue}</p>
          </div>
          <p className="text-2xl font-semibold text-success break-words">{formatCurrency(profile.totalRevenue)}</p>
          <p className="text-xs text-text-muted">{PROFILE_CONSTANTS.metrics.revenueHint}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="uppercase text-gray-400 font-semibold text-xs">{PROFILE_CONSTANTS.company.code}</span>
              <span className="text-lg font-semibold text-text-primary">{profile.companyCode}</span>
            </div>
          </div>
          <button
            onClick={() => handleCopy(profile.companyCode)}
            className={`text-sm flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-colors
              ${copied ? 'border-primary/40 border-dashed text-primary' : 'border-gray-200 text-text-secondary hover:bg-gray-50'}`}
          >
            {copied ? PROFILE_CONSTANTS.company.copied : <><Copy className="w-4 h-4" />{PROFILE_CONSTANTS.company.copy}</>}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">{PROFILE_CONSTANTS.ranking.title}</h2>
          </div>

          {profile.companyUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              <p className="text-text-muted text-sm">{PROFILE_CONSTANTS.ranking.empty}</p>
            </div>
          ) : (
            <ol className="flex flex-col divide-y divide-gray-100">
              {profile.companyUsers.map((companyUser, index) => (
                <RankingItem key={companyUser.id} user={companyUser} position={index + 1} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function RankingItem({ user, position }: { user: ProfileCompanyUser; position: number }) {
  const positionStyle = podiumStyles[position - 1] ?? 'bg-gray-100 text-text-secondary';

  return (
    <li className={`flex items-center gap-3 py-3 px-2 rounded-lg ${user.isLoggedUser ? 'bg-primary/5' : ''}`}>
      <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${positionStyle}`}>
        {position}
      </span>
      <span className="flex-1 min-w-0 flex items-center gap-2">
        <span className="truncate text-text-primary font-medium">{user.name}</span>
        {user.isLoggedUser && (
          <span className="shrink-0 text-[10px] font-semibold uppercase bg-accent text-white rounded-full px-2 py-0.5">
            {PROFILE_CONSTANTS.ranking.you}
          </span>
        )}
      </span>
      <span className="shrink-0 text-sm text-text-secondary">{formatOrders(user.quantityOfOrders)}</span>
    </li>
  );
}
