import { DateTime } from "luxon";

/**
 * Định dạng thời gian
 * @author dbhuan 17.01.2026
 */
export const formatDateTime = (dateStr) => {
  return DateTime.fromISO(dateStr).toFormat("dd/MM/yyyy HH:mm:ss");
};
