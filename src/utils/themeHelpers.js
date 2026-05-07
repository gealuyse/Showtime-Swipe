export const getBrandColor = (theaterName) => {
    if (!theaterName) return '#e50914'; // Default
    if (theaterName.includes('Major')) return '#e50914';
    if (theaterName.includes('SF')) return '#007aff';
    return '#888';
};
