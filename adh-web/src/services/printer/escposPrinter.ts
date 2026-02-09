import type { TicketData, PrinterConfig } from './types';

/**
 * ESC/POS printer interface - placeholder for future implementation.
 * Will connect to thermal printers via USB/Serial/Network.
 */
export interface EscPosPrinter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  print(ticket: TicketData): Promise<void>;
  cut(): Promise<void>;
  isConnected(): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createEscPosPrinter(_config: PrinterConfig): EscPosPrinter {
  return {
    async connect() {
      /* ESC/POS: Not implemented yet */
    },
    async disconnect() {
      /* noop */
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async print(_ticket: TicketData) {
      /* ESC/POS: print() not implemented - use PDF printer */
    },
    async cut() {
      /* noop */
    },
    isConnected() {
      return false;
    },
  };
}
