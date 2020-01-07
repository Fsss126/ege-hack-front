import _ from "lodash";

export const daysBetween = (date1, date2) => {
    const one_day = 1000 * 60 * 60 * 24;
    const date1_ms = new Date(date1.getYear(), date1.getMonth(), date1.getDate()).getTime();
    const date2_ms = new Date(date2.getYear(), date2.getMonth(), date2.getDate()).getTime();
    const difference_ms = date2_ms - date1_ms;
    return Math.floor(difference_ms / one_day);
};

export const renderDate = (date, options, locale='ru') => date.toLocaleString(locale, options);
Object.assign(renderDate, {
    date: {
        day: 'numeric',
        month: 'long'
    },
    shortDate: {
        day: 'numeric',
        month: 'numeric'
    },
    hour: {
        hour: 'numeric',
        minute: 'numeric'
    }
});

export const getAuthHeader = (username, password) => ({'Authorization': `Basic ${btoa(username + ":" + password)}`});

export const trimFileExtension = (filename) => filename.replace(/\.[^/.]+$/, "");

export const getFileExtension = (filename) => {
    const filenameParts = filename.split('.');
    if (filenameParts.length < 2)
        return '';
    return `.${filenameParts.pop()}`;
};

export const downloadFile = async (url, name) => {
    console.log(url, name);
    // IE10+ : (has Blob, but not a[download] or URL)
    if (navigator.msSaveBlob) {
        let blob = await fetch(url).then(r => r.blob());
        return navigator.msSaveBlob(blob, name);
    }
    else {
        let link = document.createElement('a');
        link.download = name;
        link.href = url;
        // link.target = '_blank';
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
    }
};

export const checkInclusion = (subset, superset) => _.difference(subset, superset).length === 0;
