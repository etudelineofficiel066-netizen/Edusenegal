import { useState } from "react";
import { useListCourses, useListCourseExercises, useCreateExercise, useDeleteExercise } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Target } from "lucide-react";
import { getListCourseExercisesQueryKey } from "@workspace/api-client-react";

export function AdminExercises() {
  const { data: courses } = useListCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: exercises, isLoading: isLoadingExercises } = useListCourseExercises(selectedCourseId || 0, {
    query: { enabled: !!selectedCourseId }
  });
  
  const createMutation = useCreateExercise({
    mutation: {
      onSuccess: () => {
        if(selectedCourseId) queryClient.invalidateQueries({ queryKey: getListCourseExercisesQueryKey(selectedCourseId) });
        setIsDialogOpen(false);
        toast({ title: "Exercice créé avec succès" });
      }
    }
  });

  const deleteMutation = useDeleteExercise({
    mutation: {
      onSuccess: () => {
        if(selectedCourseId) queryClient.invalidateQueries({ queryKey: getListCourseExercisesQueryKey(selectedCourseId) });
        toast({ title: "Exercice supprimé" });
      }
    }
  });

  const [formData, setFormData] = useState({
    titre: "", contenu: "", difficulte: "debutant" as any
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedCourseId) return;
    createMutation.mutate({ data: { ...formData, coursId: selectedCourseId } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800">Gestion des exercices</h3>
        
        <div className="w-full sm:w-72">
          <Select value={selectedCourseId?.toString() || ""} onValueChange={(v) => setSelectedCourseId(parseInt(v))}>
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="Sélectionner un cours" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.titre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCourseId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <span className="font-medium text-slate-700">Exercices pour ce cours</span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-white"><Plus className="w-4 h-4 mr-1"/> Ajouter</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Créer un exercice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>Titre</Label>
                    <Input value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Difficulté</Label>
                    <Select value={formData.difficulte} onValueChange={(v: any) => setFormData({...formData, difficulte: v})}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debutant">Débutant</SelectItem>
                        <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                        <SelectItem value="avance">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Énoncé de l'exercice</Label>
                    <Textarea value={formData.contenu} onChange={e => setFormData({...formData, contenu: e.target.value})} rows={8} required />
                  </div>
                  <Button type="submit" disabled={createMutation.isPending} className="w-full">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Créer"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingExercises ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : exercises?.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucun exercice pour ce cours.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Titre</th>
                    <th className="px-6 py-3">Difficulté</th>
                    <th className="px-6 py-3 text-center">A une solution</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exercises?.map((exo) => (
                    <tr key={exo.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        <Target className="w-4 h-4 text-secondary" /> {exo.titre}
                      </td>
                      <td className="px-6 py-4 capitalize">{exo.difficulte}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${exo.hasSolution ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {exo.hasSolution ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => { if(confirm("Supprimer ?")) deleteMutation.mutate({ id: exo.id }); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500">
          Veuillez sélectionner un cours ci-dessus pour gérer ses exercices.
        </div>
      )}
    </div>
  );
}
