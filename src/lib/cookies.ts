/**
 * Utilidades para manejar cookies de forma más segura
 */

const getSecuritySuffix = () => {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  return `${secure ? '; Secure' : ''}; SameSite=Strict`;
};

export const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${getSecuritySuffix()}`;
};

export const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.slice(nameEQ.length));
    }
  }

  return '';
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/${getSecuritySuffix()}`;
};
