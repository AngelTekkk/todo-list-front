export const getDaysLeftColor = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    return daysLeft > 7
        ? 'rgb(72,204,104)'
        : daysLeft > 3
            ? 'rgb(253,220,117)'
            : 'rgb(250,108,121)';
};