export const transformTheatersToTimeline = (theaters, movieDuration) => {
    if (!theaters || !Array.isArray(theaters)) return [];

    const flatShowtimes = [];

    theaters.forEach(theater => {
        if (!theater.showtimes || !Array.isArray(theater.showtimes)) return;

        theater.showtimes.forEach((show, index) => {
            // Normalize Time: "14:00" string or object with startTime/time
            let rawTime = typeof show === 'string' ? show : (show.startTime || show.time);

            // Basic validation
            if (!rawTime) return;

            // Extract HH:mm if it's an ISO string
            const startTime = rawTime.includes('T') ? rawTime.split('T')[1].slice(0, 5) : rawTime;

            // Derive other fields (Handle both string-showtimes and object-showtimes)
            // If show is string, we rely on theater defaults.
            // If show is object, we prefer its values.
            const system = (typeof show === 'object' && show.system) ? show.system : (theater.system || "Digital 2D");
            const price = (typeof show === 'object' && show.price) ? show.price : (theater.price || 240);
            const hall = (typeof show === 'object' && show.hall) ? show.hall : (theater.hall || "Hall 1");
            const language = (typeof show === 'object' && show.language) ? show.language : (theater.language || "EN/TH");

            // Calculate End Time if duration is provided
            const endTime = movieDuration ? calculateEndTime(startTime, movieDuration) : null;

            // Unique ID generation (Robust against duplicates)
            const uniqueId = typeof show === 'object' && show.id
                ? show.id
                : `${theater.id || theater.name}-${startTime}-${index}`;

            flatShowtimes.push({
                id: uniqueId,
                startTime: startTime, // Provide cleaned time
                time: startTime, // Ensure 'time' prop exists for components expecting it
                endTime: endTime, // Pre-calculated end time
                theaterName: theater.name, // Explicitly set from parent
                theater: theater, // Pass full theater object for branding access
                brand: theater.brand || 'Major', // Default brand if missing
                location: theater.location || {},
                system: system,
                hall: hall,
                price: price,
                language: language
            });
        });
    });

    // Sort by time (00:00 -> 23:59)
    return flatShowtimes.sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });
};

export const calculateEndTime = (startTime, durationInput) => {
    if (!startTime) return "-";

    try {
        // 1. Parse Duration
        let durationMinutes = 0;

        if (typeof durationInput === 'number') {
            durationMinutes = durationInput;
        } else if (typeof durationInput === 'string') {
            // Handle "2h 15m" or "135"
            if (durationInput.includes('h') || durationInput.includes('m')) {
                const parts = durationInput.match(/(\d+)h\s*(\d*)m?/);
                if (parts) {
                    const h = parseInt(parts[1]) || 0;
                    const m = parseInt(parts[2]) || 0;
                    durationMinutes = (h * 60) + m;
                }
            } else {
                durationMinutes = parseInt(durationInput, 10);
            }
        }

        if (isNaN(durationMinutes) || durationMinutes <= 0) return "-";

        // 2. Parse Start Time
        let hours, minutes;
        if (startTime.includes('T')) {
            const timePart = startTime.split('T')[1];
            [hours, minutes] = timePart.split(':').map(Number);
        } else {
            [hours, minutes] = startTime.split(':').map(Number);
        }

        if (isNaN(hours) || isNaN(minutes)) return "-";

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        // 3. Add duration + 20 mins (Ads)
        date.setMinutes(date.getMinutes() + durationMinutes + 20);

        if (isNaN(date.getTime())) return "-";

        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
        return "-";
    }
};
