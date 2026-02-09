import { useCallback, useMemo, useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { Plus, Trash2, MessageSquare, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectOption } from '@/components/ui';
import { Combobox } from '@/components/ui';
import { FormPanel } from '@/components/layout';
import { cn } from '@/lib/utils';
import type {
  TransactionFormProps,
  TransactionFormData,
  TransactionLineFormData,
} from './types';
import { ReglementDialog } from '../dialogs/ReglementDialog';
import { CommentaireDialog } from '../dialogs/CommentaireDialog';

const DEVISES = [
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - Dollar US' },
  { value: 'GBP', label: 'GBP - Livre Sterling' },
  { value: 'CHF', label: 'CHF - Franc Suisse' },
  { value: 'JPY', label: 'JPY - Yen Japonais' },
];

const MOCK_COMPTES = [
  { value: '10001', label: '10001 - DUPONT Jean' },
  { value: '10002', label: '10002 - MARTIN Sophie' },
  { value: '10003', label: '10003 - GARCIA Pedro' },
  { value: '10004', label: '10004 - SMITH John' },
];

function createEmptyLine(): TransactionLineFormData {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantite: 1,
    prixUnitaire: 0,
    montant: 0,
    devise: 'EUR',
    codeProduit: '',
  };
}

const formatCurrency = (value: number, devise = 'EUR') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: devise }).format(
    value,
  );

export function TransactionForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  readOnly = false,
}: TransactionFormProps) {
  const [reglementOpen, setReglementOpen] = useState(false);
  const [commentaireOpen, setCommentaireOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: TransactionFormData = {
    compteNumero: initialData?.compteNumero ?? '',
    compteNom: initialData?.compteNom ?? '',
    devise: initialData?.devise ?? 'EUR',
    dateTransaction:
      initialData?.dateTransaction ?? new Date().toISOString().slice(0, 10),
    lignes: initialData?.lignes ?? [createEmptyLine()],
    commentaire: initialData?.commentaire ?? '',
    mode,
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lignes',
  });

  const lignes = watch('lignes');
  const devise = watch('devise');
  const commentaire = watch('commentaire');

  const totals = useMemo(() => {
    const totalHT = lignes.reduce((sum, l) => sum + (l.montant || 0), 0);
    return { totalHT, totalTTC: totalHT };
  }, [lignes]);

  const handleAddLine = useCallback(() => {
    append(createEmptyLine());
  }, [append]);

  const handleRemoveLine = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  const handleLineChange = useCallback(
    (index: number, field: 'quantite' | 'prixUnitaire', value: number) => {
      const currentLignes = getValues('lignes');
      const ligne = currentLignes[index];
      if (!ligne) return;

      const updated = { ...ligne, [field]: value };
      updated.montant = updated.quantite * updated.prixUnitaire;
      setValue(`lignes.${index}`, updated, { shouldDirty: true });
    },
    [getValues, setValue],
  );

  const handleCompteChange = useCallback(
    (value: string) => {
      setValue('compteNumero', value);
      const compte = MOCK_COMPTES.find((c) => c.value === value);
      if (compte) {
        const nom = compte.label.split(' - ')[1] ?? '';
        setValue('compteNom', nom);
      }
    },
    [setValue],
  );

  const handleCommentaireSave = useCallback(
    (value: string) => {
      setValue('commentaire', value);
      setCommentaireOpen(false);
    },
    [setValue],
  );

  const onFormSubmit: SubmitHandler<TransactionFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Header: Mode badge */}
      <div className="flex items-center justify-between">
        <Badge variant={mode === 'GP' ? 'default' : 'secondary'}>
          {mode === 'GP' ? 'Vente GP' : 'Vente Boutique'}
        </Badge>
        {commentaire && (
          <span className="text-xs text-on-surface-muted italic truncate max-w-xs">
            {commentaire}
          </span>
        )}
      </div>

      {/* Section 1: Compte + Date + Devise */}
      <FormPanel title="Informations transaction">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Compte */}
          <div className="flex flex-col gap-1.5">
            <Label required>Compte</Label>
            <Combobox
              options={MOCK_COMPTES}
              value={watch('compteNumero')}
              onChange={handleCompteChange}
              placeholder="Rechercher un compte..."
              searchPlaceholder="Nom ou numero..."
              emptyMessage="Aucun compte trouve"
              disabled={readOnly}
              error={errors.compteNumero?.message}
            />
            {errors.compteNumero && (
              <span className="text-xs text-danger">{errors.compteNumero.message}</span>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label required>Date</Label>
            <Input
              type="date"
              {...register('dateTransaction', { required: 'Date obligatoire' })}
              disabled={readOnly}
              error={errors.dateTransaction?.message}
            />
            {errors.dateTransaction && (
              <span className="text-xs text-danger">{errors.dateTransaction.message}</span>
            )}
          </div>

          {/* Devise */}
          <div className="flex flex-col gap-1.5">
            <Label required>Devise</Label>
            <Select
              {...register('devise', { required: 'Devise obligatoire' })}
              disabled={readOnly}
              error={errors.devise?.message}
            >
              {DEVISES.map((d) => (
                <SelectOption key={d.value} value={d.value}>
                  {d.label}
                </SelectOption>
              ))}
            </Select>
            {errors.devise && (
              <span className="text-xs text-danger">{errors.devise.message}</span>
            )}
          </div>
        </div>
      </FormPanel>

      {/* Section 2: Lines */}
      <FormPanel
        title="Lignes de transaction"
        actions={
          !readOnly ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLine}
            >
              <Plus className="h-4 w-4" />
              Ajouter une ligne
            </Button>
          ) : undefined
        }
      >
        {errors.lignes?.message && (
          <div className="mb-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {errors.lignes.message}
          </div>
        )}

        {/* Inline editable lines */}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                'grid gap-2 items-end rounded-md border border-border p-3',
                readOnly && 'opacity-70',
              )}
              style={{
                gridTemplateColumns:
                  mode === 'Boutique'
                    ? '120px 1fr 80px 120px 120px 40px'
                    : '1fr 80px 120px 120px 40px',
              }}
            >
              {mode === 'Boutique' && (
                <div>
                  {index === 0 && (
                    <Label className="text-xs mb-1">Code produit</Label>
                  )}
                  <Input
                    {...register(`lignes.${index}.codeProduit`)}
                    placeholder="Code"
                    disabled={readOnly}
                    error={
                      errors.lignes?.[index]?.codeProduit?.message
                    }
                  />
                </div>
              )}
              <div>
                {index === 0 && (
                  <Label className="text-xs mb-1" required>
                    Description
                  </Label>
                )}
                <Input
                  {...register(`lignes.${index}.description`, {
                    required: 'Obligatoire',
                  })}
                  placeholder="Description article"
                  disabled={readOnly}
                  error={errors.lignes?.[index]?.description?.message}
                />
              </div>
              <div>
                {index === 0 && (
                  <Label className="text-xs mb-1" required>
                    Qte
                  </Label>
                )}
                <Input
                  type="number"
                  min={1}
                  step={1}
                  {...register(`lignes.${index}.quantite`, {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Min 1' },
                    onChange: (e) =>
                      handleLineChange(index, 'quantite', Number(e.target.value)),
                  })}
                  disabled={readOnly}
                  error={errors.lignes?.[index]?.quantite?.message}
                  className="text-right"
                />
              </div>
              <div>
                {index === 0 && (
                  <Label className="text-xs mb-1" required>
                    Prix unit.
                  </Label>
                )}
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register(`lignes.${index}.prixUnitaire`, {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Min 0' },
                    onChange: (e) =>
                      handleLineChange(
                        index,
                        'prixUnitaire',
                        Number(e.target.value),
                      ),
                  })}
                  disabled={readOnly}
                  error={errors.lignes?.[index]?.prixUnitaire?.message}
                  className="text-right"
                />
              </div>
              <div>
                {index === 0 && (
                  <Label className="text-xs mb-1">Montant</Label>
                )}
                <div className="flex h-9 items-center justify-end rounded-md bg-surface-dim px-3 text-sm font-medium">
                  {formatCurrency(lignes[index]?.montant ?? 0, devise)}
                </div>
              </div>
              <div>
                {index === 0 && <div className="h-4 mb-1" />}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLine(index)}
                  disabled={readOnly || fields.length <= 1}
                  className="text-danger hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </FormPanel>

      {/* Section 3: Totals */}
      <FormPanel title="Totaux">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-muted">Total HT</span>
              <span className="font-medium">
                {formatCurrency(totals.totalHT, devise)}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
              <span>Total TTC</span>
              <span>{formatCurrency(totals.totalTTC, devise)}</span>
            </div>
          </div>
        </div>
      </FormPanel>

      {/* Section 4: Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCommentaireOpen(true)}
            disabled={readOnly}
          >
            <MessageSquare className="h-4 w-4" />
            Commentaire
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setReglementOpen(true)}
            disabled={readOnly || totals.totalTTC <= 0}
          >
            <CreditCard className="h-4 w-4" />
            Reglement
          </Button>
          <Button type="submit" disabled={readOnly || isSubmitting}>
            {isSubmitting ? 'Validation...' : 'Valider'}
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <ReglementDialog
        open={reglementOpen}
        onOpenChange={setReglementOpen}
        totalTransaction={totals.totalTTC}
        devise={devise}
        onValidate={() => setReglementOpen(false)}
      />

      <CommentaireDialog
        open={commentaireOpen}
        onOpenChange={setCommentaireOpen}
        value={commentaire}
        onSave={handleCommentaireSave}
      />
    </form>
  );
}
