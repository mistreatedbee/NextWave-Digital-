import { getInsforgeClientOptional } from '../lib/insforgeClient';

export async function logAudit(
  userId: string,
  entityType: string,
  entityId: string,
  action: 'create' | 'update' | 'delete',
  changes?: unknown
): Promise<void> {
  const client = getInsforgeClientOptional();
  if (!client) return;

  await client.from('audit_logs').insert({
    user_id: userId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    changes_json: JSON.stringify(changes ?? {}),
  });
}
