import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Combobox } from '@/components/ui';
import { Select, SelectOption } from '@/components/ui';
import type { BilateraleDialogProps } from '../transaction/types';

const DEVISES = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CHF', label: 'CHF' },
];

const MOCK_COMPTES = [
  { value: '10001', label: '10001 - DUPONT Jean' },
  { value: '10002', label: '10002 - MARTIN Sophie' },
  { value: '10003', label: '10003 - GARCIA Pedro' },
  { value: '10004', label: '10004 - SMITH John' },
];

export function BilateraleDialog({
  open,
  onOpenChange,
  onValidate,
}: BilateraleDialogProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [montant, setMontant] = useState(0);
  const [devise, setDevise] = useState('EUR');
  const [error, setError] = useState('');

  const handleValidate = useCallback(() => {
    if (!source) {
      setError('Compte source obligatoire');
      return;
    }
    if (!destination) {
      setError('Compte destination obligatoire');
      return;
    }
    if (source === destination) {
      setError('Les comptes source et destination doivent etre differents');
      return;
    }
    if (montant <= 0) {
      setError('Le montant doit etre superieur a 0');
      return;
    }
    setError('');
    onValidate({
      compteSource: source,
      compteDestination: destination,
      montant,
      devise,
    });
  }, [source, destination, montant, devise, onValidate]);

  const handleReset = useCallback(() => {
    setSource('');
    setDestination('');
    setMontant(0);
    setDevise('EUR');
    setError('');
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Operation bilaterale</DialogTitle>
          <DialogDescription>
            Transfert entre deux comptes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label required>Compte source</Label>
            <Combobox
              options={MOCK_COMPTES}
              value={source}
              onChange={setSource}
              placeholder="Selectionner le compte source..."
              searchPlaceholder="Rechercher..."
              emptyMessage="Aucun compte"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label required>Compte destination</Label>
            <Combobox
              options={MOCK_COMPTES}
              value={destination}
              onChange={setDestination}
              placeholder="Selectionner le compte destination..."
              searchPlaceholder="Rechercher..."
              emptyMessage="Aucun compte"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label required>Montant</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={montant || ''}
                onChange={(e) => setMontant(Number(e.target.value) || 0)}
                placeholder="0,00"
                className="text-right"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label required>Devise</Label>
              <Select value={devise} onChange={(e) => setDevise(e.target.value)}>
                {DEVISES.map((d) => (
                  <SelectOption key={d.value} value={d.value}>
                    {d.label}
                  </SelectOption>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Annuler
          </Button>
          <Button onClick={handleValidate}>Valider</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
