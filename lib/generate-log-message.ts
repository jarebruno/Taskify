import { ACTION, AuditLog } from '@prisma/client';

export const generateLogMessage = (log: AuditLog) => {
  switch (log.action) {
    case ACTION.CREATE:
      return `created ${log.entityType.toLowerCase()} ${log.entityTitle}`
    case ACTION.UPDATE:
      return `updated ${log.entityType.toLowerCase()} ${log.entityTitle}`
    case ACTION.DELETE:
      return `deleted ${log.entityType.toLowerCase()} ${log.entityTitle}`
    default:
      return `unknown action ${log.entityType.toLowerCase()} ${log.entityTitle}`
  }
}