export function timeElapsed(timestamp: number | Date): string {
    const now = Date.now();
    const then = timestamp instanceof Date ? timestamp.getTime() : timestamp;

    const totalSeconds = Math.floor((now - then) / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    // Drop hours if 0
    return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}
