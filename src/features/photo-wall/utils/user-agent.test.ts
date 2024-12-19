import { describe, expect, it } from 'vitest';
import { isBot } from './user-agent';

describe('isBot', () => {
    it('should return false if userAgent is null', () => {
        expect(isBot(null)).toBe(false);
    });

    it('should return false if userAgent is undefined', () => {
        expect(isBot(undefined)).toBe(false);
    });

    it('should return false if userAgent is an empty string', () => {
        expect(isBot('')).toBe(false);
    });

    it('should return true for a known bot userAgent', () => {
        expect(
            isBot(
                'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            )
        ).toBe(true);
    });

    it('should return false for a non-bot userAgent', () => {
        expect(
            isBot(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            )
        ).toBe(false);
    });

    it('should return true for another known bot userAgent', () => {
        expect(
            isBot(
                'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
            )
        ).toBe(true);
    });

    it('should return true for a bot userAgent with mixed case', () => {
        expect(
            isBot(
                'Mozilla/5.0 (compatible; GoogleBot/2.1; +http://www.google.com/bot.html)'
            )
        ).toBe(true);
    });

    it('should return false for a userAgent that contains "bot" as part of a word (in the middle)', () => {
        expect(
            isBot(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 NotABotNot'
            )
        ).toBe(false);
    });

    it('should return true for a Facebook bot userAgent', () => {
        expect(
            isBot(
                'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
            )
        ).toBe(true);
    });

    it('should return true for another Facebook bot userAgent', () => {
        expect(isBot('facebookexternalhit/1.1')).toBe(true);
    });

    it('should return true for a Facebook bot userAgent with different version', () => {
        expect(
            isBot(
                'facebookexternalhit/1.0 (+http://www.facebook.com/externalhit_uatext.php)'
            )
        ).toBe(true);
    });

    it('should return true for a Facebook bot userAgent with mixed case', () => {
        expect(
            isBot(
                'FacebookExternalHit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
            )
        ).toBe(true);
    });
});
