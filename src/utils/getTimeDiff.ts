export const getTimeDiff = (
    start: Date,
    end: Date
): { hours: number; minutes: number; seconds: number } => {
    const diffMs = Math.abs(end.getTime() - start.getTime());

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    return { hours, minutes, seconds };
};

export const formatTimeDiff = (start: Date, end: Date = new Date()) => {
    const { hours, minutes, seconds } = getTimeDiff(start, end);

    return `${hours}h ${minutes}m ${seconds}s`;
};

export const getEstimatedFinishTime = (
    startTime: Date,
    totalJobs: number,
    processedSoFar: number
): Date | undefined => {
    if (processedSoFar <= 0) return undefined;

    const now = new Date();
    const elapsedMs = now.getTime() - startTime.getTime();

    const msPerJob = elapsedMs / processedSoFar;
    const remainingJobs = Math.max(totalJobs - processedSoFar, 0);
    const remainingMs = msPerJob * remainingJobs;

    return new Date(now.getTime() + remainingMs);
};
