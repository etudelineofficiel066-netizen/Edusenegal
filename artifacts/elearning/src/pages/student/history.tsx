import { useGetSubscriptionHistory } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, CheckCircle2, XCircle, CreditCard, ShieldCheck } from "lucide-react";

export default function History() {
  const { data: history, isLoading } = useGetSubscriptionHistory();

  if (isLoading) return <MainLayout><LoadingScreen /></MainLayout>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente': return <Clock className="w-4 h-4 mr-1 text-amber-500" />;
      case 'confirmé': return <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />;
      case 'rejeté': return <XCircle className="w-4 h-4 mr-1 text-rose-500" />;
      case 'actif': return <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />;
      case 'expiré': return <Clock className="w-4 h-4 mr-1 text-slate-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmé': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejeté': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'actif': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'expiré': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
            Historique
          </h1>
          <p className="text-slate-600 mb-10">Retrouvez l'historique de vos paiements et abonnements.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payments List */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">
                <CreditCard className="w-5 h-5 text-primary" /> Mes Paiements
              </h2>
              
              {history?.payments.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-500">
                  Aucun paiement trouvé
                </div>
              ) : (
                <div className="space-y-4">
                  {history?.payments.map(payment => (
                    <div key={payment.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-slate-900 text-lg">{payment.montant} FCFA</div>
                          <div className="text-sm text-slate-500 mt-1">Pass {payment.typeAbonnement.replace('_', ' ')}</div>
                        </div>
                        <Badge variant="outline" className={`capitalize font-medium flex items-center ${getStatusColor(payment.statut)}`}>
                          {getStatusIcon(payment.statut)} {payment.statut.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        Le {format(new Date(payment.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscriptions List */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">
                <ShieldCheck className="w-5 h-5 text-secondary" /> Mes Abonnements
              </h2>
              
              {history?.subscriptions.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-500">
                  Aucun abonnement trouvé
                </div>
              ) : (
                <div className="space-y-4">
                  {history?.subscriptions.map(sub => (
                    <div key={sub.id} className={`p-5 rounded-2xl shadow-sm border transition-shadow ${sub.statut === 'actif' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-bold text-slate-900">Pass {sub.typeAbonnement.replace('_', ' ')}</div>
                        </div>
                        <Badge variant="outline" className={`capitalize font-medium flex items-center ${getStatusColor(sub.statut)}`}>
                          {getStatusIcon(sub.statut)} {sub.statut}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm bg-white/50 rounded-xl p-3">
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Début</div>
                          <div className="font-medium text-slate-800">{format(new Date(sub.dateDebut), "dd/MM/yyyy")}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Fin</div>
                          <div className="font-medium text-slate-800">{format(new Date(sub.dateFin), "dd/MM/yyyy")}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
