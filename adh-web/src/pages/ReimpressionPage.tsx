import { useEffect, useState } from 'react';
import { ScreenLayout } from '@/components/layout';
import { SessionStatusBadge } from '@/components/caisse/session';
import { useSessionStore } from '@/stores';
import type { SessionHistoryItem } from '@/types';

export function ReimpressionPage() {
  const history = useSessionStore((s) => s.history);
  const isLoading = useSessionStore((s) => s.isLoadingHistory);
  const loadHistory = useSessionStore((s) => s.loadHistory);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleReprint = async (session: SessionHistoryItem) => {
    setSelectedId(session.id);
    setIsPrinting(true);
    try {
      // TODO: Integrate with printer service when backend endpoint available
      // await printerApi.reprintSession(session.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsPrinting(false);
      setSelectedId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScreenLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h2 className="text-xl font-semibold">Reimpression tickets</h2>
          <p className="text-on-surface-muted text-sm mt-1">
            Selectionnez une session pour reimprimer le ticket
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-on-surface-muted">
            Chargement des sessions...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-on-surface-muted">
            Aucune session trouvee
          </div>
        ) : (
          <div className="border border-border rounded-md divide-y divide-border">
            {history.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-surface-hover"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-on-surface-muted">
                    #{session.id}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(session.dateOuverture)}
                      {session.dateFermeture && (
                        <span className="text-on-surface-muted">
                          {' '}— {formatDate(session.dateFermeture)}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      Caisse {session.caisseNumero || session.caisseId}
                    </p>
                  </div>
                  <SessionStatusBadge status={session.status} size="sm" />
                </div>
                <button
                  onClick={() => handleReprint(session)}
                  disabled={isPrinting && selectedId === session.id}
                  className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-surface-hover disabled:opacity-50"
                >
                  {isPrinting && selectedId === session.id
                    ? 'Impression...'
                    : 'Reimprimer'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenLayout>
  );
}
