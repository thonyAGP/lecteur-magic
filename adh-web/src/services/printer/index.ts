export { generateTicketPdf, printTicket, downloadTicket } from './pdfPrinter';
export { createEscPosPrinter } from './escposPrinter';
export type { EscPosPrinter } from './escposPrinter';
export type {
  TicketHeader,
  TicketLine,
  TicketFooter,
  TicketData,
  PrinterConfig,
} from './types';
