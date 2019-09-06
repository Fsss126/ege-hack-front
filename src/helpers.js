export const daysBetween = (date1, date2) => {
    const one_day = 1000 * 60 * 60 * 24;
    const date1_ms = new Date(date1.getYear(), date1.getMonth(), date1.getDate()).getTime();
    const date2_ms = new Date(date2.getYear(), date2.getMonth(), date2.getDate()).getTime();
    const difference_ms = date2_ms - date1_ms;
    return Math.floor(difference_ms / one_day);
};
