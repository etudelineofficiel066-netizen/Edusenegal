import { useListUsers, useListSubscriptions } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, BookOpen, Target, FileCheck, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AdminCourses } from "@/components/admin/admin-courses";
import { AdminPayments } from "@/components/admin/admin-payments";
import { AdminExercises } from "@/components/admin/admin-exercises";
import { AdminSolutions } from "@/components/admin/admin-solutions";

export default function AdminDashboard() {
  
  // Basic list components for Users and Subscriptions to keep this file concise
  const UsersList = () => {
    const { data: users, isLoading } = useListUsers();
    if(isLoading) return <div className="p-10 text-center text-slate-500">Chargement...</div>;
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users?.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-slate-500">#{u.id}</td>
                <td className="px-6 py-3 font-medium text-slate-900">{u.nom}</td>
                <td className="px-6 py-3 text-slate-600">{u.email}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-500">{format(new Date(u.dateInscription), 'dd/MM/yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const SubsList = () => {
    const { data: subs, isLoading } = useListSubscriptions();
    if(isLoading) return <div className="p-10 text-center text-slate-500">Chargement...</div>;
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Période</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subs?.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{s.userNom}</div>
                  <div className="text-xs text-slate-500">{s.userEmail}</div>
                </td>
                <td className="px-6 py-4 font-medium text-primary">Pass {s.typeAbonnement.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.statut === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {s.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {format(new Date(s.dateDebut), 'dd/MM/yy')} <br/>au {format(new Date(s.dateFin), 'dd/MM/yy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Espace Administrateur
            </h1>
            <p className="text-slate-600">Gérez le contenu, les utilisateurs et les paiements de la plateforme.</p>
          </div>

          <Tabs defaultValue="payments" className="w-full">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
              <TabsList className="h-14 w-full justify-start bg-transparent gap-2 min-w-max">
                <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 h-10">
                  <CreditCard className="w-4 h-4 mr-2" /> Paiements en attente
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 h-10">
                  <BookOpen className="w-4 h-4 mr-2" /> Cours
                </TabsTrigger>
                <TabsTrigger value="exercises" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 h-10">
                  <Target className="w-4 h-4 mr-2" /> Exercices
                </TabsTrigger>
                <TabsTrigger value="solutions" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 h-10">
                  <FileCheck className="w-4 h-4 mr-2" /> Solutions
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 h-10">
                  <Users className="w-4 h-4 mr-2" /> Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="subs" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 h-10">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Abonnements
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="payments" className="focus-visible:outline-none"><AdminPayments /></TabsContent>
            <TabsContent value="courses" className="focus-visible:outline-none"><AdminCourses /></TabsContent>
            <TabsContent value="exercises" className="focus-visible:outline-none"><AdminExercises /></TabsContent>
            <TabsContent value="solutions" className="focus-visible:outline-none"><AdminSolutions /></TabsContent>
            
            <TabsContent value="users" className="focus-visible:outline-none">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Liste des utilisateurs</h3>
              <UsersList />
            </TabsContent>
            
            <TabsContent value="subs" className="focus-visible:outline-none">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Tous les abonnements</h3>
              <SubsList />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </MainLayout>
  );
}
