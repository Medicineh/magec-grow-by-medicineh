import { useQuery } from '@tanstack/react-query';
import { getAlertEvaluationHistory, getLatestAlertEvaluation } from '@/lib/alertSubscriptions';

export function useAlertHistory(chatId?: string) {
  const enabled = Boolean(chatId);

  const historyQuery = useQuery({
    queryKey: ['alert-history', chatId],
    queryFn: () => getAlertEvaluationHistory(chatId as string, 15),
    enabled,
    refetchInterval: 60_000,
  });

  const latestQuery = useQuery({
    queryKey: ['alert-latest', chatId],
    queryFn: () => getLatestAlertEvaluation(chatId as string),
    enabled,
    refetchInterval: 60_000,
  });

  return {
    history: historyQuery.data ?? [],
    latest: latestQuery.data,
    isLoading: historyQuery.isLoading || latestQuery.isLoading,
  };
}
