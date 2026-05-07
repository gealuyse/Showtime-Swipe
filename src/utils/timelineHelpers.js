export const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    // Add duration + 20 minutes for ads/trailers
    const totalDuration = durationMinutes + 20;
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);

    return endDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const groupShowtimesByPeriod = (showtimes) => {
    return {
        Afternoon: showtimes.filter(s => {
            const hour = parseInt(s.time.split(':')[0]);
            return hour >= 12 && hour < 17;
        }),
        Evening: showtimes.filter(s => {
            const hour = parseInt(s.time.split(':')[0]);
            return hour >= 17 && hour < 21;
        }),
        LateNight: showtimes.filter(s => {
            const hour = parseInt(s.time.split(':')[0]);
            return hour >= 21 || hour < 4;
        })
    };
};
