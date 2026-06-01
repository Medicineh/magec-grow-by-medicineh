import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexSource = readFileSync(resolve(process.cwd(), 'src/pages/Index.tsx'), 'utf8');

describe('Index Telegram notification boundaries', () => {
  it('does not send Telegram messages when browser alerts are displayed', () => {
    expect(indexSource).not.toContain('sendTelegramAlert');
    expect(indexSource).not.toContain('last-telegram-alert-time');
  });
});
