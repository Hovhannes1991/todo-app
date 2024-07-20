export const secondsToHMS = (baseSeconds, separator = ":") => {
    const hours = String(Math.floor(baseSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((baseSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(baseSeconds % 60).padStart(2, "0");

    return {
        hh_mm_ss: `${hours}${separator}${minutes}${separator}${seconds}`,
        mm_ss: `${minutes}${separator}${seconds}`,
    }
}