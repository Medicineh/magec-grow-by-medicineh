import { describe, expect, it, vi } from 'vitest';
import {
  recordEvaluationPersistenceResult,
  recordSubscriptionUpdateResult,
} from './weatherAlertPersistence';

describe('weather alert persistence accounting', () => {
  it('records a simulated evaluation insert error and prevents further processing', () => {
    const metrics = { subscriptionsProcessed: 0, errorsCount: 0 };
    const logger = { error: vi.fn() };
    const evaluationError = new Error('evaluation insert failed');

    const persisted = recordEvaluationPersistenceResult(
      'subscription-1',
      evaluationError,
      metrics,
      logger,
    );

    expect(persisted).toBe(false);
    expect(metrics).toEqual({ subscriptionsProcessed: 0, errorsCount: 1 });
    expect(logger.error).toHaveBeenCalledWith('Failed to persist weather alert evaluation', {
      subscriptionId: 'subscription-1',
      evaluationError,
    });
  });

  it('records a simulated subscription update error and logs resend risk after Telegram accepts the alert', () => {
    const metrics = { subscriptionsProcessed: 0, errorsCount: 0 };
    const logger = { error: vi.fn() };
    const updateError = new Error('subscription update failed');

    const persisted = recordSubscriptionUpdateResult(
      'subscription-2',
      updateError,
      true,
      metrics,
      logger,
    );

    expect(persisted).toBe(false);
    expect(metrics).toEqual({ subscriptionsProcessed: 0, errorsCount: 1 });
    expect(logger.error).toHaveBeenNthCalledWith(1, 'Failed to persist weather alert subscription state', {
      subscriptionId: 'subscription-2',
      updateError,
    });
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      'Telegram accepted the alert, but its state was not persisted; resend risk exists',
      { subscriptionId: 'subscription-2', updateError },
    );
  });

  it('counts a subscription as processed only after its final state is persisted', () => {
    const metrics = { subscriptionsProcessed: 0, errorsCount: 0 };

    expect(recordSubscriptionUpdateResult('subscription-3', null, false, metrics)).toBe(true);
    expect(metrics).toEqual({ subscriptionsProcessed: 1, errorsCount: 0 });
  });
});
