import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

interface Photo {
  id: string;
  image_url: string;
  title: string | null;
}

interface Album {
  id: string;
  title: string;
}

export const ClientAreaPage = () => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Busca o álbum pelo código de acesso usando uma função segura (RPC)
      // Isso evita expor a tabela de álbuns publicamente
      const { data: albumData, error: albumError } = await supabase
        .rpc('get_album_by_code', { code_input: accessCode })
        .single();

      if (albumError || !albumData) throw new Error("Senha incorreta ou álbum não encontrado.");

      const foundAlbum = albumData as Album;
      setAlbum(foundAlbum);

      // 2. Busca as fotos do álbum encontrado
      // Usamos outra RPC ou garantimos que a policy permita leitura se souber o ID (mas RPC é mais seguro aqui)
      const { data: photosData, error: photosError } = await supabase
        .rpc('get_photos_by_album_id', { p_album_id: foundAlbum.id });

      if (photosError) throw photosError;
      setPhotos((photosData as Photo[]) || []);

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: error.message
      });
      setAlbum(null);
    } finally {
      setLoading(false);
    }
  }

  if (album) {
    return (
      <section className="pt-32 pb-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{album.title}</h1>
            <Button variant="outline" onClick={() => { setAlbum(null); setAccessCode(""); }}>Sair</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={photo.image_url} alt={photo.title || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
            {photos.length === 0 && <p className="text-gray-500">Nenhuma foto neste álbum.</p>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="client-area" className="pt-32 pb-20 px-4 bg-background min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Área do Cliente</CardTitle>
          <CardDescription>
            Digite sua senha de acesso para visualizar suas fotos.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Senha de Acesso</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="code" 
                type="password" 
                className="pl-9" 
                placeholder="••••••" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Acessar Galeria"}
          </Button>
        </CardFooter>
        </form>
      </Card>
    </section>
  );
};