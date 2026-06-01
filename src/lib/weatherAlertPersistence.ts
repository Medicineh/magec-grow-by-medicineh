type PersistenceError = unknown;

type PersistenceMetrics = {
  subscriptionsProcessed: number;
  errorsCount: number;
};

type PersistenceLogger = Pick<Console, 'error'>;

export function recordEvaluationPersistenceResult(
  subscriptionId: string,
  evaluationError: PersistenceError,
  metrics: PersistenceMetrics,
  logger: PersistenceLogger = console,
): boolean {
  if (!evaluationError) return true;

  metrics.errorsCount += 1;
  logger.error('Failed to persist weather alert evaluation', {
    subscriptionId,
    evaluationError,
  });
  return false;
}

export function recordSubscriptionUpdateResult(
  subscriptionId: string,
  updateError: PersistenceError,
  telegramMessageAccepted: boolean,
  metrics: PersistenceMetrics,
  logger: PersistenceLogger = console,
): boolean {
  if (!updateError) {
    metrics.subscriptionsProcessed += 1;
    return true;
  }

  metrics.errorsCount += 1;
  logger.error('Failed to persist weather alert subscription state', {
    subscriptionId,
    updateError,
  });

  if (telegramMessageAccepted) {
    logger.error('Telegram accepted the alert, but its state was not persisted; resend risk exists', {
      subscriptionId,
      updateError,
    });
  }

  return false;
}
