import type { ApiResponse } from "@/services/api/apiClient"

export interface MergeHistory {
  id: number
  sourceAccount: string
  targetAccount: string
  mergeDate: Date
  operator: string
  status: string
}

export interface Account {
  accountNumber: string
  balance: number
  status: string
  createdDate: Date
}

export interface MergeValidation {
  isClosureInProgress: boolean
  networkStatus: string
  validationStatus: string
}

// RM-343: histo_fusionseparation_saisie table structure
export interface HistoFusionSeparationSaisie {
  id: number
  fusionId: number
  saisieDate: Date
  operatorId: string
  sourceData: string
  tempStatus: string
  validationCode: string
}

// RM-30: gm-recherche_____gmr table structure  
export interface GmRecherche {
  id: number
  searchCriteria: string
  accountRef: string
  searchDate: Date
  resultCount: number
  searchType: string
}

// RM-39: depot_garantie___dga table structure
export interface DepotGarantie {
  id: number
  accountNumber: string
  guaranteeAmount: number
  depositDate: Date
  status: string
  guaranteeType: string
  expirationDate: Date
}

// RM-340: histo_fusionseparation table structure
export interface HistoFusionSeparation {
  id: number
  sourceAccountId: string
  targetAccountId: string
  operationType: string
  operationDate: Date
  operatorId: string
  beforeState: string
  afterState: string
  rollbackPossible: boolean
}

// RM-47: compte_gm________cgm table structure
export interface CompteGm {
  accountId: string
  gmReference: string
  accountType: string
  balance: number
  lastModified: Date
  status: string
  networkId: string
}

// RM-23: reseau_cloture___rec table structure
export interface ReseauCloture {
  networkId: string
  closureStatus: string
  closureDate: Date
  closureType: string
  operatorId: string
  isBlocked: boolean
}

// RM-51: fusion_eclatementfec table structure
export interface FusionEclatement {
  id: number
  operationType: string
  sourceAccounts: string[]
  targetAccount: string
  operationDate: Date
  status: string
  validationRequired: boolean
}

// RM-33: prestations______pre table structure
export interface Prestations {
  id: number
  accountId: string
  prestationType: string
  amount: number
  serviceDate: Date
  description: string
  status: string
}

// RM-131: fichier_validation table structure
export interface FichierValidation {
  fileId: string
  fileName: string
  validationType: string
  validationDate: Date
  validationStatus: string
  errorCount: number
  processedRecords: number
}

// RM-37: commentaire_gm_________acc table structure
export interface CommentaireGm {
  id: number
  accountId: string
  commentText: string
  commentDate: Date
  operatorId: string
  commentType: string
  isActive: boolean
}

// RM-831: import_go_erreur_affection table structure
export interface ImportGoErreurAffection {
  id: number
  importBatch: string
  errorType: string
  affectionCode: string
  errorMessage: string
  recordNumber: number
  processingDate: Date
  resolved: boolean
}

// RM-837: ##_pv_customer_dat table structure
export interface PvCustomerDat {
  customerId: string
  customerData: string
  processVersion: string
  validationStatus: string
  lastUpdate: Date
  dataHash: string
  isActive: boolean
}

// RM-46: mvt_prestation___mpr table structure
export interface MvtPrestation {
  id: number
  accountId: string
  movementType: string
  prestationId: number
  amount: number
  movementDate: Date
  description: string
  operatorId: string
}

// RM-79: gratuites________gra table structure
export interface Gratuites {
  id: number
  accountId: string
  gratuitType: string
  amount: number
  validFrom: Date
  validTo: Date
  description: string
  isActive: boolean
}

// RM-137: fichier_histotel table structure
export interface FichierHistotel {
  fileId: string
  hotelCode: string
  historyDate: Date
  recordType: string
  dataContent: string
  processedStatus: string
  errorCount: number
}

// RM-834: tpe_par_terminal table structure
export interface TpeParTerminal {
  terminalId: string
  tpeCode: string
  terminalType: string
  installationDate: Date
  status: string
  lastTransaction: Date
  merchantId: string
}

// RM-805: vente_par_moyen_paiement table structure
export interface VenteParMoyenPaiement {
  id: number
  saleId: string
  paymentMethod: string
  amount: number
  transactionDate: Date
  terminalId: string
  authorizationCode: string
  status: string
}

// RM-40: comptable________cte table structure
export interface Comptable {
  accountingId: string
  accountId: string
  debitAmount: number
  creditAmount: number
  accountingDate: Date
  description: string
  operatorId: string
  validated: boolean
}

// RM-807: plafond_lit table structure
export interface PlafondLit {
  id: number
  accountId: string
  bedType: string
  maxLimit: number
  currentUsage: number
  periodStart: Date
  periodEnd: Date
  isActive: boolean
}

// RM-312: ez_card table structure
export interface EzCard {
  cardId: string
  accountId: string
  cardType: string
  issueDate: Date
  expirationDate: Date
  cardStatus: string
  balance: number
  lastUsed: Date
}

// RM-31: gm-complet_______gmc table structure
export interface GmComplet {
  id: number
  accountId: string
  completeData: string
  completionDate: Date
  completionStatus: string
  operatorId: string
  validationLevel: string
  lastModified: Date
}

// RM-35: personnel_go______go table structure
export interface PersonnelGo {
  personnelId: string
  goCode: string
  firstName: string
  lastName: string
  position: string
  department: string
  hireDate: Date
  status: string
}

// RM-786: qualite_avant_reprise table structure
export interface QualiteAvantReprise {
  id: number
  accountId: string
  qualityScore: number
  assessmentDate: Date
  assessorId: string
  qualityLevel: string
  repriseRequired: boolean
  notes: string
}

// RM-123: fichier_messagerie table structure
export interface FichierMessagerie {
  messageId: string
  senderId: string
  recipientId: string
  messageContent: string
  sentDate: Date
  messageType: string
  isRead: boolean
  attachmentCount: number
}

// RM-147: change_vente_____chg table structure
export interface ChangeVente {
  changeId: number
  originalSaleId: string
  newSaleId: string
  changeDate: Date
  changeType: string
  operatorId: string
  reason: string
  status: string
}

// RM-80: codes_autocom____aut table structure
export interface CodesAutocom {
  codeId: string
  autocomType: string
  codeValue: string
  description: string
  validFrom: Date
  validTo: Date
  isActive: boolean
  priority: number
}

// RM-44: change___________chg table structure
export interface Change {
  changeId: number
  accountId: string
  changeType: string
  oldValue: string
  newValue: string
  changeDate: Date
  operatorId: string
  approved: boolean
}

// RM-266: cc_comptable table structure
export interface CcComptable {
  ccId: string
  accountingCode: string
  accountId: string
  amount: number
  accountingDate: Date
  description: string
  operatorId: string
  validated: boolean
  journalRef: string
}

// RM-309: vente____________vep table structure
export interface Vente {
  saleId: string
  accountId: string
  saleAmount: number
  saleDate: Date
  productCode: string
  quantity: number
  unitPrice: number
  discountAmount: number
  operatorId: string
  status: string
}

// RM-15: transac_entete_bar table structure
export interface TransacEnteteBar {
  transactionId: string
  barCode: string
  transactionDate: Date
  totalAmount: number
  itemCount: number
  operatorId: string
  terminalId: string
  status: string
}

// RM-307: vente_option_veo table structure
export interface VenteOptionVeo {
  id: number
  saleId: string
  optionCode: string
  optionValue: string
  optionDate: Date
  operatorId: string
  status: string
  price: number
}

// RM-041: depot_objets_____doa table structure
export interface DepotObjetsDoa {
  id: number
  accountId: string
  objectType: string
  depositDate: Date
  returnDate: Date | null
  status: string
  description: string
  operatorId: string
}

// RM-463: heure_de_passage table structure
export interface HeureDePassage {
  id: number
  accountId: string
  passageTime: Date
  location: string
  direction: string
  terminalId: string
  operatorId: string
  validated: boolean
}

// RM-947: Table_947 table structure
export interface Table947 {
  id: number
  referenceCode: string
  dataValue: string
  category: string
  createdDate: Date
  status: string
  priority: number
  description: string
}

// RM-034: hebergement______heb table structure
export interface HebergementHeb {
  id: number
  accountId: string
  accommodationType: string
  checkInDate: Date
  checkOutDate: Date
  roomNumber: string
  guestCount: number
  totalAmount: number
  status: string
}

// RM-168: heb_circuit______hci table structure
export interface HebCircuitHci {
  id: number
  circuitCode: string
  accommodationId: number
  sequenceOrder: number
  duration: number
  transportType: string
  status: string
  operatorId: string
}

// RM-268: cc_total_par_type table structure
export interface CcTotalParType {
  id: number
  accountId: string
  totalType: string
  totalAmount: number
  calculationDate: Date
  periodStart: Date
  periodEnd: Date
  operatorId: string
  validated: boolean
}

// RM-272: cc_type_detail table structure
export interface CcTypeDetail {
  id: number
  typeCode: string
  detailCode: string
  description: string
  unitPrice: number
  taxRate: number
  category: string
  isActive: boolean
}

// RM-048: lignes_de_solde__sld table structure
export interface LignesDeSoldeSld {
  id: number
  accountId: string
  balanceType: string
  balanceAmount: number
  balanceDate: Date
  description: string
  operatorId: string
  validated: boolean
}

// RM-271: cc_total table structure
export interface CcTotal {
  id: number
  accountId: string
  totalAmount: number
  calculationDate: Date
  operatorId: string
  validated: boolean
  currency: string
  exchangeRate: number
}

// RM-298: participants_____par table structure
export interface ParticipantsPar {
  participantId: string
  accountId: string
  firstName: string
  lastName: string
  birthDate: Date
  participantType: string
  status: string
  registrationDate: Date
  voyageId: string
}

// RM-29: voyages__________voy table structure
export interface VoyagesVoy {
  voyageId: string
  voyageCode: string
  destination: string
  departureDate: Date
  returnDate: Date
  voyageType: string
  capacity: number
  status: string
  organizerId: string
}

// RM-19: bl_detail table structure
export interface BlDetail {
  id: number
  billId: string
  lineNumber: number
  productCode: string
  quantity: number
  unitPrice: number
  totalAmount: number
  description: string
  taxRate: number
}

// RM-38: comptable_gratuite table structure
export interface ComptableGratuite {
  id: number
  accountId: string
  gratuitType: string
  accountingAmount: number
  gratuitDate: Date
  description: string
  operatorId: string
  validated: boolean
}

// RM-358: import_mod table structure
export interface ImportMod {
  importId: string
  moduleCode: string
  importDate: Date
  fileSource: string
  recordCount: number
  processStatus: string
  errorCount: number
  operatorId: string
}

// RM-42: depot_devises____dda table structure
export interface DepotDevisesDda {
  id: number
  accountId: string
  currencyCode: string
  depositAmount: number
  exchangeRate: number
  localAmount: number
  depositDate: Date
  status: string
  operatorId: string
}

// RM-366: pms_print_param table structure
export interface PmsPrintParam {
  parameterId: string
  printType: string
  parameterName: string
  parameterValue: string
  isActive: boolean
  lastModified: Date
  operatorId: string
  description: string
}

// RM-301: details_partici__dpa table structure
export interface DetailsParticiDpa {
  detailId: number
  participantId: string
  detailType: string
  detailValue: string
  detailDate: Date
  status: string
  operatorId: string
  validated: boolean
}

// RM-43: solde_devises____sda table structure
export interface SoldeDevisesSda {
  id: number
  accountId: string
  currencyCode: string
  balanceAmount: number
  exchangeRate: number
  localBalance: number
  balanceDate: Date
  status: string
  operatorId: string
}

// RM-382: pv_discount_reasons table structure
export interface PvDiscountReasons {
  reasonId: string
  reasonCode: string
  reasonDescription: string
  discountType: string
  maxDiscountPercent: number
  isActive: boolean
  validFrom: Date
  validTo: Date
}

export interface AccountMergeState {
  mergeHistories: MergeHistory[]
  sourceAccount: Account | null
  targetAccount: Account | null
  validationState: MergeValidation | null
  isLoading: boolean
  error: string | null
  mergeProgress: number
  currentStep: string
  histoSaisie: HistoFusionSeparationSaisie[]
  gmRecherches: GmRecherche[]
  depotGaranties: DepotGarantie[]
  histoFusions: HistoFusionSeparation[]
  comptesGm: CompteGm[]
  reseauClotures: ReseauCloture[]
  fusionEclatements: FusionEclatement[]
  prestations: Prestations[]
  fichiersValidation: FichierValidation[]
  commentairesGm: CommentaireGm[]
  importGoErreurs: ImportGoErreurAffection[]
  pvCustomerData: PvCustomerDat[]
  mvtPrestations: MvtPrestation[]
  gratuites: Gratuites[]
  fichiersHistotel: FichierHistotel[]
  tpeTerminaux: TpeParTerminal[]
  ventesPayment: VenteParMoyenPaiement[]
  comptables: Comptable[]
  plafondsLit: PlafondLit[]
  ezCards: EzCard[]
  gmComplets: GmComplet[]
  personnelGo: PersonnelGo[]
  qualiteAvantReprises: QualiteAvantReprise[]
  fichiersMessagerie: FichierMessagerie[]
  changesVente: ChangeVente[]
  codesAutocom: CodesAutocom[]
  changes: Change[]
  ccComptables: CcComptable[]
  ventes: Vente[]
  transacEnteteBar: TransacEnteteBar[]
  venteOptions: VenteOptionVeo[]
  depotObjets: DepotObjetsDoa[]
  heuresPassage: HeureDePassage[]
  table947: Table947[]
  hebergements: HebergementHeb[]
  hebCircuits: HebCircuitHci[]
  ccTotalParTypes: CcTotalParType[]
  ccTypeDetails: CcTypeDetail[]
  lignesSolde: LignesDeSoldeSld[]
  ccTotals: CcTotal[]
  participants: ParticipantsPar[]
  voyages: VoyagesVoy[]
  blDetails: BlDetail[]
  comptableGratuites: ComptableGratuite[]
  importMods: ImportMod[]
  depotDevises: DepotDevisesDda[]
  pmsPrintParams: PmsPrintParam[]
  detailsPartici: DetailsParticiDpa[]
  soldeDevises: SoldeDevisesSda[]
  pvDiscountReasons: PvDiscountReasons[]
}

export interface AccountMergeActions {
  validateMergeConditions: (sourceAccountId: string, targetAccountId: string) => Promise<void>
  executeMerge: (sourceAccountId: string, targetAccountId: string) => Promise<void>
  createMergeHistory: (sourceAccount: string, targetAccount: string, operator: string) => Promise<void>
  rollbackMerge: (mergeHistoryId: number) => Promise<void>
  printMergeTicket: (mergeHistoryId: number) => Promise<void>
}

export type ValidateResponse = ApiResponse<MergeValidation>
export type ExecuteMergeResponse = ApiResponse<MergeHistory>
export type MergeHistoryResponse = ApiResponse<MergeHistory[]>