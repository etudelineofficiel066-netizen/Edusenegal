import { GraduationCap } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg animate-bounce relative z-10">
          <GraduationCap className="text-white w-8 h-8" />
        </div>
      </div>
      <h3 className="font-display text-xl font-medium text-slate-700 animate-pulse">
        Chargement...
      </h3>
    </div>
  );
}
