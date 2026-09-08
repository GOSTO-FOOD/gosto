import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#190E12] text-[#F1E7D0]">
      <Card className="w-full max-w-md mx-4 bg-[#24151A] border-[#67414A]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[#D98A5D]" />
            <h1 className="text-2xl font-bold">Page introuvable</h1>
          </div>

          <p className="mt-4 text-sm text-[#D4BFA3]">
            Cette page n'existe pas. Revenez au menu GOSTO FOOD pour continuer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
