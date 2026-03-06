export const formatCurrency = (value: number, currency: string = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short') => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (format === 'short') {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(d);
  }
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'long',
    month: 'long',
    year: 'numeric',
  }).format(d);
};

export const formatMonthYear = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(d);
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter((c) => typeof c === 'string').join(' ');
};
