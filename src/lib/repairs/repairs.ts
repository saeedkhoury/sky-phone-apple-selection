/**
 * The seven repair services the shop actually offers.
 *
 * Deliberately carries NO prices. The shop's previous site published indicative
 * per-device figures; the owner asked for them to be left off, so every surface
 * here routes to a real quote instead. Do not reintroduce prices without his
 * say-so — an indicative number becomes a promise in the customer's head.
 */
export interface RepairService {
  id: string
  /** Translation key for the service name, e.g. rep_r1. */
  labelKey: string
  /** Line-icon key. */
  icon: string
}

export const repairServices: readonly RepairService[] = [
  { id: 'r1', labelKey: 'rep_r1', icon: 'screen' },
  { id: 'r2', labelKey: 'rep_r2', icon: 'battery' },
  { id: 'r3', labelKey: 'rep_r3', icon: 'tools' },
  { id: 'r4', labelKey: 'rep_r4', icon: 'water' },
  { id: 'r5', labelKey: 'rep_r5', icon: 'tools' },
  { id: 'r6', labelKey: 'rep_r6', icon: 'laptop' },
  { id: 'r7', labelKey: 'rep_r7', icon: 'console' },
]
