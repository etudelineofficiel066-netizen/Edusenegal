import { useListPendingPayments, useValidatePayment, useRejectPayment } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, ExternalLink, Loader2 } from "lucide-react";
import { getListPendingPaymentsQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function AdminPayments() {
  const { data: payments, isLoading } = useListPendingPayments();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: getListPendingPaymentsQueryKey() });
    toast({ title: "Action effectuée avec succès" });
  };

  const validateMutation = useValidatePayment({ mutation: { onSuccess: onSuccessAction } });
  const rejectMutation = useRejectPayment({ mutation: { onSuccess: onSuccessAction } });

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Paiements en attente</h3>
        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
          {payments?.length || 0} en attente
        </div>
      </div>

      {payments?.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
          Aucun paiement en attente.
        </div>
      ) : (
        <div className="grid gap-4">
          {payments?.map(payment => (
            <div key={payment.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-slate-900">{payment.userNom}</span>
                  <span className="text-sm text-slate-500">{payment.userEmail}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="bg-slate-100 px-3 py-1 rounded-md font-medium text-slate-700">
                    Pass {payment.typeAbonnement.replace('_', ' ')}
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md font-bold">
                    {payment.montant} FCFA
                  </div>
                  <div className="text-slate-500 flex items-center">
                    {format(new Date(payment.date), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                {payment.captureEcran && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 text-primary border-primary/20">
                        <ExternalLink className="w-4 h-4 mr-2" /> Preuve
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-1">
                      <img src={payment.captureEcran} alt="Preuve de paiement" className="w-full h-auto rounded-lg" />
                    </DialogContent>
                  </Dialog>
                )}
                
                <div className="flex gap-2 ml-auto md:ml-0">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => {
                      if(confirm("Rejeter ce paiement ?")) rejectMutation.mutate({ id: payment.id });
                    }}
                    disabled={rejectMutation.isPending || validateMutation.isPending}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button 
                    className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                    onClick={() => {
                      if(confirm("Valider ce paiement et activer l'abonnement ?")) validateMutation.mutate({ id: payment.id });
                    }}
                    disabled={rejectMutation.isPending || validateMutation.isPending}
                  >
                    <Check className="w-5 h-5 mr-2" /> Valider
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
