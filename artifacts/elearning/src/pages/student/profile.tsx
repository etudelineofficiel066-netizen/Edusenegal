import { useAuth } from "@/lib/auth-context";
import { MainLayout } from "@/components/layout/main-layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return <MainLayout><LoadingScreen /></MainLayout>;

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-primary/80 relative">
              <div className="absolute inset-0 bg-pattern opacity-[0.05]"></div>
            </div>
            
            <div className="px-8 pb-12 relative">
              <div className="w-24 h-24 bg-white rounded-full p-2 absolute -top-12 shadow-lg">
                <div className="w-full h-full bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-3xl font-display font-bold">
                  {user.nom.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="pt-16">
                <h1 className="text-3xl font-display font-bold text-slate-900">{user.nom}</h1>
                <p className="text-slate-500 font-medium capitalize">{user.role}</p>
                
                <div className="mt-10 grid gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Adresse email</p>
                      <p className="font-bold text-slate-900">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Membre depuis le</p>
                      <p className="font-bold text-slate-900">
                        {format(new Date(user.dateInscription), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Statut du compte</p>
                      <p className="font-bold text-slate-900 capitalize flex items-center gap-2">
                        {user.role}
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
