/**
 * Utility functions for sending Telegram notifications.
 * Uses an internal Supabase Edge Function so bot secrets stay in backend.
 */

import { supabase } from '@/integrations/supabase/client';
import { GrowingAlert } from '@/lib/weather';

export async function sendTelegramAlert(chatId: string, message: string): Promise<boolean> {
    if (!chatId || !message) {
        return false;
    }

    try {
        const { error } = await supabase.functions.invoke('send-telegram-alert', {
            body: {
                chatId,
                message,
            },
        });

        if (error) {
            console.error('Error sending Telegram alert via backend endpoint:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to send Telegram alert via backend endpoint:', error);
        return false;
    }
}

/**
 * Format an array of weather/growing alerts into a Telegram message string.
 */
export function formatAlertsForTelegram(alerts: GrowingAlert[]): string {
    if (!alerts || alerts.length === 0) return '';

    let message = '🚨 <b>Alertas de Magec Grow</b> 🚨\n\n';

    alerts.forEach(alert => {
        let emoji = '⚠️';
        if (alert.type === 'wind') emoji = '💨';
        if (alert.type === 'precipitation') emoji = '🌧️';
        if (alert.type === 'windGust') emoji = '🌪️';
        if (alert.type === 'dewPoint') emoji = '💧';
        if (alert.type === 'frost') emoji = '🥶';
        if (alert.type === 'heat') emoji = '🔥';
        if (alert.type === 'uv') emoji = '☀️';

        // Fallback to the object's icon if specified
        if (alert.icon && emoji === '⚠️') emoji = alert.icon;

        message += `${emoji} <b>${alert.message}</b>\n`;
    });

    return message;
}
