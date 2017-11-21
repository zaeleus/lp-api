const zeroPad = (n: number): string => (n < 10) ? `0${n}` : `${n}`;

export const formatPartialDate = (year?: number, month?: number, day?: number): string => {
    if (year && !month) {
        return `${year}`;
    } else if (year && month && !day) {
        return `${year}-${zeroPad(month)}`;
    } else if (year && month && day) {
        return `${year}-${zeroPad(month)}-${zeroPad(day)}`;
    } else {
        return "";
    }
};
