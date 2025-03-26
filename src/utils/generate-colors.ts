
export const generateDynamicColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);
};