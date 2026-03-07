/**
 * VG Mapper - Global Variables Documentation
 * Maps 40 VG variables used across ADH programs
 */

import type { GlobalVarMapping } from './types.js';

export const VG_MAPPINGS: GlobalVarMapping[] = [
  { vgId: 38, name: 'VG_LANGUAGE', type: 'ALPHA', description: 'Code langue (FR, EN, ES)', usedInPrograms: [42, 43] },
  { vgId: 60, name: 'VG_USER_RIGHTS', type: 'NUMERIC', description: 'Droits utilisateur', usedInPrograms: [121, 131] },
  { vgId: 63, name: 'VG_SESSION_ID', type: 'NUMERIC', description: 'ID session caisse', usedInPrograms: [121, 131, 237] },
];

export const mapGlobalVar = (vgId: number): GlobalVarMapping | undefined => {
  return VG_MAPPINGS.find(v => v.vgId === vgId);
};

export const getAllGlobalVars = (): GlobalVarMapping[] => {
  return VG_MAPPINGS;
};
