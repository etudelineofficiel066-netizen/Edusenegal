import { useState } from "react";
import { useListCourses, useListCourseExercises, useCreateSolution, useGetExerciseSolution } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Edit } from "lucide-react";
import { getListCourseExercisesQueryKey, getGetExerciseSolutionQueryKey } from "@workspace/api-client-react";

export function AdminSolutions() {
  const { data: courses } = useListCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: exercises } = useListCourseExercises(selectedCourseId || 0, {
    query: { enabled: !!selectedCourseId }
  });
  
  const { data: currentSolution, isLoading: loadingSolution } = useGetExerciseSolution(activeExerciseId || 0, {
    query: { enabled: !!activeExerciseId, retry: false }
  });

  const [contenu, setContenu] = useState("");

  // Open dialog and set content if editing
  const handleOpenDialog = (exoId: number, hasSolution: boolean) => {
    setActiveExerciseId(exoId);
    if (!hasSolution) {
      setContenu("");
    }
  };

  // Sync content when solution loads
  useState(() => {
    if (currentSolution) setContenu(currentSolution.contenu);
  });

  const createMutation = useCreateSolution({
    mutation: {
      onSuccess: () => {
        if(selectedCourseId) queryClient.invalidateQueries({ queryKey: getListCourseExercisesQueryKey(selectedCourseId) });
        if(activeExerciseId) queryClient.invalidateQueries({ queryKey: getGetExerciseSolutionQueryKey(activeExerciseId) });
        setActiveExerciseId(null);
        toast({ title: "Solution enregistrée avec succès" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!activeExerciseId) return;
    createMutation.mutate({ id: activeExerciseId, data: { contenu } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800">Gestion des solutions</h3>
        
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
          <h4 className="font-medium text-slate-700 mb-4 border-b border-slate-100 pb-2">Exercices du cours</h4>
          <div className="grid gap-3">
            {exercises?.map((exo) => (
              <div key={exo.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">{exo.titre}</div>
                  <div className="text-sm text-slate-500 line-clamp-1 max-w-lg mt-1">{exo.contenu}</div>
                </div>
                <div>
                  <Button 
                    variant={exo.hasSolution ? "outline" : "default"} 
                    className={exo.hasSolution ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "bg-primary"}
                    onClick={() => handleOpenDialog(exo.id, exo.hasSolution)}
                  >
                    {exo.hasSolution ? <><CheckCircle2 className="w-4 h-4 mr-2"/> Modifier</> : <><Edit className="w-4 h-4 mr-2"/> Ajouter</>}
                  </Button>
                </div>
              </div>
            ))}
            {exercises?.length === 0 && <p className="text-center text-slate-500 py-4">Aucun exercice trouvé.</p>}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500">
          Veuillez sélectionner un cours ci-dessus.
        </div>
      )}

      <Dialog open={!!activeExerciseId} onOpenChange={(open) => !open && setActiveExerciseId(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Solution de l'exercice</DialogTitle>
          </DialogHeader>
          {loadingSolution && activeExerciseId ? (
             <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label>Contenu de la solution détaillée (Texte/Markdown)</Label>
                <Textarea 
                  value={contenu || currentSolution?.contenu || ""} 
                  onChange={e => setContenu(e.target.value)} 
                  rows={12} 
                  required 
                  className="font-mono text-sm"
                  placeholder="Écrivez la solution détaillée ici..."
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Enregistrer la solution"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
