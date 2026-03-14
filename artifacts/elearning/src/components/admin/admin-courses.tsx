import { useState } from "react";
import { useListCourses, useCreateCourse, useDeleteCourse, Course } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, BookOpen, Loader2 } from "lucide-react";
import { getListCoursesQueryKey } from "@workspace/api-client-react";

export function AdminCourses() {
  const { data: courses, isLoading } = useListCourses();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const createMutation = useCreateCourse({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        setIsDialogOpen(false);
        toast({ title: "Cours créé avec succès" });
      }
    }
  });

  const deleteMutation = useDeleteCourse({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        toast({ title: "Cours supprimé" });
      }
    }
  });

  const [formData, setFormData] = useState({
    titre: "", description: "", contenu: "", chapitre: "", difficulte: "debutant" as any, pdfUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: formData });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Gestion des cours</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white"><Plus className="w-4 h-4 mr-2"/> Ajouter un cours</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau cours</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label>Titre</Label>
                <Input value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} required />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="grid gap-2">
                <Label>Chapitre</Label>
                <Input value={formData.chapitre} onChange={e => setFormData({...formData, chapitre: e.target.value})} required />
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
                <Label>Contenu (Texte/Markdown)</Label>
                <Textarea value={formData.contenu} onChange={e => setFormData({...formData, contenu: e.target.value})} rows={8} />
              </div>
              <div className="grid gap-2">
                <Label>URL PDF (Optionnel)</Label>
                <Input value={formData.pdfUrl} onChange={e => setFormData({...formData, pdfUrl: e.target.value})} />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Créer le cours"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Cours</th>
                  <th className="px-6 py-4">Chapitre</th>
                  <th className="px-6 py-4">Difficulté</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses?.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-primary" /> {course.titre}
                    </td>
                    <td className="px-6 py-4">{course.chapitre}</td>
                    <td className="px-6 py-4 capitalize">{course.difficulte}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          if(confirm("Supprimer ce cours ?")) deleteMutation.mutate({ id: course.id });
                        }}
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
    </div>
  );
}
