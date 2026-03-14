import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useGetMySubscription, useSubmitPayment, useUploadPaymentScreenshot } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ShieldCheck, Upload, CheckCircle2, AlertCircle, Clock, CreditCard, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"1_mois" | "3_mois" | "9_mois">("1_mois");
  const [file, setFile] = useState<File | null>(null);

  const { data: subscription, isLoading: isLoadingSub } = useGetMySubscription({
    query: { retry: false } // Avoid retrying on 404
  });

  const uploadMutation = useUploadPaymentScreenshot();
  const paymentMutation = useSubmitPayment();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file) {
      toast({ title: "Capture requise", description: "Veuillez fournir la capture d'écran du paiement.", variant: "destructive" });
      return;
    }

    try {
      // 1. Upload file
      const uploadRes = await uploadMutation.mutateAsync({ data: { file } });
      
      // 2. Submit payment record
      await paymentMutation.mutateAsync({ 
        data: { 
          typeAbonnement: selectedPlan, 
          captureEcran: uploadRes.url 
        } 
      });

      toast({
        title: "Paiement soumis",
        description: "Votre paiement a été envoyé. Un administrateur va le valider sous peu.",
      });
      setLocation("/history");

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Erreur lors de l'envoi du paiement",
        variant: "destructive"
      });
    }
  };

  const plans = [
    { id: "1_mois", label: "1 Mois", price: "1000 FCFA", desc: "Idéal pour tester" },
    { id: "3_mois", label: "3 Mois", price: "2000 FCFA", desc: "Le plus populaire" },
    { id: "9_mois", label: "9 Mois", price: "3000 FCFA", desc: "Année complète" },
  ] as const;

  if (isLoadingSub) return <MainLayout><LoadingScreen /></MainLayout>;

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-full py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Abonnement Premium
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto">
              Débloquez l'accès à tous nos cours et exercices corrigés pour exceller dans vos études.
            </p>
          </div>

          {subscription && subscription.statut === "actif" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-10 flex items-start gap-6 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Abonnement Actif</h3>
                <p className="text-emerald-800 mb-4">
                  Vous avez actuellement un abonnement valide jusqu'au <strong>{new Date(subscription.dateFin).toLocaleDateString('fr-FR')}</strong>.
                </p>
                <Button variant="outline" asChild className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                  <Link href="/courses">Aller aux cours</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-5 gap-8">
            {/* Payment Process */}
            <div className="md:col-span-3 space-y-8">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-md shadow-primary/20">1</span>
                  <h2 className="text-xl font-bold text-slate-900">Choisissez votre plan</h2>
                </div>
                
                <RadioGroup value={selectedPlan} onValueChange={(v: any) => setSelectedPlan(v)} className="grid gap-4">
                  {plans.map((plan) => (
                    <Label
                      key={plan.id}
                      htmlFor={plan.id}
                      className={`relative flex cursor-pointer rounded-2xl border-2 p-5 hover:bg-slate-50 transition-all ${
                        selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                      <div className="flex w-full items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{plan.label}</p>
                          <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-xl text-primary">{plan.price}</p>
                        </div>
                      </div>
                      {selectedPlan === plan.id && (
                        <div className="absolute top-1/2 right-4 -translate-y-1/2">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold flex items-center justify-center text-sm shadow-md shadow-secondary/20">2</span>
                  <h2 className="text-xl font-bold text-slate-900">Effectuez le transfert</h2>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                  <p className="text-slate-700 mb-4 text-center">Envoyez le montant correspondant par Wave ou Orange Money au numéro suivant :</p>
                  <div className="flex justify-center items-center gap-8 mb-2">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                        <span className="font-extrabold text-blue-600 text-xl">W</span>
                      </div>
                      <p className="font-medium">Wave</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                        <span className="font-extrabold text-orange-600 text-xl">OM</span>
                      </div>
                      <p className="font-medium">Orange Money</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <span className="inline-block bg-white border-2 border-slate-200 text-3xl font-display font-bold tracking-widest px-8 py-4 rounded-2xl text-slate-800 shadow-sm">
                      76 904 24 23
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-emerald-500/20">3</span>
                  <h2 className="text-xl font-bold text-slate-900">Envoyez la preuve</h2>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-slate-700">Capture d'écran du paiement</Label>
                  <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                    <div className="text-center">
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                          <p className="font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          <Button variant="ghost" size="sm" className="mt-4 text-destructive hover:bg-destructive/10" onClick={() => setFile(null)}>
                            Changer d'image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                            >
                              <span>Téléverser un fichier</span>
                              <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs leading-5 text-slate-500 mt-2">PNG, JPG jusqu'à 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <Button 
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25" 
                    size="lg"
                    onClick={onSubmit}
                    disabled={!file || uploadMutation.isPending || paymentMutation.isPending}
                  >
                    {uploadMutation.isPending || paymentMutation.isPending ? (
                      <>Traitement en cours...</>
                    ) : (
                      <>Soumettre pour validation</>
                    )}
                  </Button>
                  <p className="text-center text-sm text-slate-500 mt-4 flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" /> Validation généralement sous 24h
                  </p>
                </div>
              </div>

            </div>

            {/* Sidebar Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  Important
                </h3>
                <ul className="space-y-4 text-slate-300 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    <p>Assurez-vous que le montant envoyé correspond exactement au plan choisi.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    <p>La capture d'écran doit montrer clairement le SMS ou reçu de confirmation complet.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    <p>Votre compte sera activé dès validation par notre équipe (lun-sam 8h-20h).</p>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
                <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Paiement 100% sécurisé</h4>
                <p className="text-sm text-slate-500">
                  Transactions gérées directement via les opérateurs mobiles.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
