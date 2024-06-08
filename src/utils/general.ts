export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const msToTime = (duration, en = false) => {
    const days = duration / (1000 * 60 * 60 * 24);
    const absoluteDays = Math.floor(days);
    const d = absoluteDays
        ? absoluteDays + (en ? ` Day${absoluteDays > 1 ? 's' : ''} ` : '일 ')
        : '';

    const hours = (days - absoluteDays) * 24;
    const absoluteHours = Math.floor(hours);
    const h = absoluteHours
        ? absoluteHours +
          (en ? ` Hour${absoluteHours > 1 ? 's' : ''} ` : '시간 ')
        : '';

    const minutes = (hours - absoluteHours) * 60;
    const absoluteMinutes = Math.floor(minutes);
    const m = absoluteMinutes
        ? absoluteMinutes +
          (en ? ` Minute${absoluteMinutes > 1 ? 's' : ''} ` : '분 ')
        : '';

    const seconds = (minutes - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds
        ? absoluteSeconds +
          (en ? ` Second${absoluteSeconds > 1 ? 's' : ''} ` : '초 ')
        : '';

    return (d + h + m + s).trim();
};
