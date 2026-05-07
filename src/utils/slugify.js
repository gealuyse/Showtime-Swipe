export const createSlug = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word characters and hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};
