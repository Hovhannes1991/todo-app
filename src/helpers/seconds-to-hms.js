export const secondsToHMS = (base_seconds, separator = ":") => {
    const hours = String(Math.floor(base_seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((base_seconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(base_seconds % 60).padStart(2, "0");

    return {
        hh_mm_ss: `${hours}${separator}${minutes}${separator}${seconds}`,
        mm_ss: `${minutes}${separator}${seconds}`,
    }
}