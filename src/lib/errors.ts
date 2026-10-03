export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'detail' in error && typeof error.detail === 'string') return error.detail;
  return fallback;
}
