import { describe,it,expect } from 'vitest';
import { fictionalDate,validDate,ageOn,daysBetween } from '../src/lib/calendar';
describe('calendar-year clock',()=>{
 it('shifts the editorial calendar, not a duration',()=>{expect(fictionalDate(new Date('2026-10-09T18:00:00Z'))).toBe('3026-10-09');expect(fictionalDate(new Date('2026-10-10T18:00:00Z'))).toBe('3026-10-10');});
 it('rolls over at Chicago midnight',()=>{expect(fictionalDate(new Date('2026-10-10T04:59:59Z'),'America/Chicago')).toBe('3026-10-09');expect(fictionalDate(new Date('2026-10-10T05:00:00Z'),'America/Chicago')).toBe('3026-10-10');});
 it('handles year transitions and independent time zones',()=>{const now=new Date('2027-01-01T01:00:00Z');expect(fictionalDate(now,'America/Chicago')).toBe('3026-12-31');expect(fictionalDate(now,'Asia/Tokyo')).toBe('3027-01-01');});
 it('handles both DST transitions without changing the local day',()=>{for(const at of ['2026-03-08T07:59:59Z','2026-03-08T08:00:00Z'])expect(fictionalDate(new Date(at),'America/Chicago')).toBe('3026-03-08');for(const at of ['2026-11-01T06:59:59Z','2026-11-01T07:00:00Z'])expect(fictionalDate(new Date(at),'America/Chicago')).toBe('3026-11-01');});
 it('clamps a lost leap day explicitly and preserves ordinary leap days',()=>{expect(fictionalDate(new Date('2000-02-29T18:00:00Z'),'UTC')).toBe('3000-02-28');expect(fictionalDate(new Date('2028-02-29T18:00:00Z'),'UTC')).toBe('3028-02-29');expect(fictionalDate(new Date('2000-03-01T18:00:00Z'),'UTC')).toBe('3000-03-01');});
 it('validates calendar dates and ages at birthdays',()=>{expect(validDate('3026-02-29')).toBe(false);expect(validDate('3028-02-29')).toBe(true);expect(validDate('3026-13-01')).toBe(false);expect(ageOn('2997-10-14','3026-10-09')).toBe(28);expect(ageOn('2997-10-14','3026-10-14')).toBe(29);expect(daysBetween('3026-12-31','3027-01-01')).toBe(1);});
 it('rejects an invalid editorial time zone rather than silently guessing',()=>{expect(()=>fictionalDate(new Date(),'Moon/Nowhere')).toThrow();});
});
