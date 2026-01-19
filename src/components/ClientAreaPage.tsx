import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Folder, ArrowLeft } from "lucide-react";

interface Photo {
  id: string;
  image_url: string;
  title: string | null;
  subfolder_id: string | null;
}

interface Album {
  id: string;
  title: string;
}

interface Subfolder {
  id: string;
  title: string;
  album_id: string;
}

export const ClientAreaPage = () => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
  const [currentSubfolder, setCurrentSubfolder] = useState<Subfolder | null>(null);

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

      // 3. Busca as subpastas do álbum
      const { data: subfoldersData, error: subfoldersError } = await supabase
        .from("subfolders")
        .select("*")
        .eq("album_id", foundAlbum.id)
        .order("created_at", { ascending: true });

      if (!subfoldersError) setSubfolders(subfoldersData || []);

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

  // Filtra as fotos com base na pasta atual (ou raiz se null)
  const displayedPhotos = photos.filter(photo => 
    currentSubfolder 
      ? photo.subfolder_id === currentSubfolder.id 
      : photo.subfolder_id === null
  );

  if (album) {
    return (
      <section className="pt-32 pb-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {currentSubfolder && (
                <Button variant="ghost" size="icon" onClick={() => setCurrentSubfolder(null)}>
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              )}
              <h1 className="text-3xl font-bold">
                {album.title}
                {currentSubfolder && <span className="text-muted-foreground font-normal"> / {currentSubfolder.title}</span>}
              </h1>
            </div>
            <Button variant="outline" onClick={() => { setAlbum(null); setAccessCode(""); setCurrentSubfolder(null); }}>Sair</Button>
          </div>

          {/* Lista de Pastas (Apenas na raiz) */}
          {!currentSubfolder && subfolders.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <Folder className="w-5 h-5 text-amber-500" /> Pastas
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {subfolders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setCurrentSubfolder(folder)}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-amber-500 hover:shadow-md transition-all group"
                  >
                    <Folder className="w-12 h-12 text-amber-100 group-hover:text-amber-500 transition-colors mb-2" fill="currentColor" />
                    <span className="font-medium text-gray-700 group-hover:text-amber-700 truncate w-full text-center">{folder.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedPhotos.map(photo => (
              <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={photo.image_url} alt={photo.title || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
            {displayedPhotos.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {currentSubfolder ? "Esta pasta está vazia." : "Nenhuma foto solta neste álbum."}
              </div>
            )}
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