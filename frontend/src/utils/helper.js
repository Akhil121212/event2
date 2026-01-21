export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    // Assuming backend is on localhost:5000
    // In production, this should be an environment variable
    return `http://localhost:5000${imagePath}`;
};
