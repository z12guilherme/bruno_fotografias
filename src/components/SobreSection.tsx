import { motion } from "framer-motion";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { Loader2 } from "lucide-react";
import photographerImageUrl from "../assets/bruno.png";

export function SobreSection() {
  const { content, loading } = useHomepageContent();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <section id="sobre" className="container mx-auto px-4 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          {content?.about?.title || "Sobre Mim"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 text-lg text-muted-foreground space-y-6 whitespace-pre-wrap">
            <p>{content?.about?.bio1 || "Olá! Sou Bruno Nascimento, um fotógrafo apaixonado por capturar a essência dos momentos..."}</p>
            {content?.about?.bio2 && <p>{content.about.bio2}</p>}
            {content?.about?.bio3 && <p>{content.about.bio3}</p>}
          </div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <img
              src={content?.about?.photographerImageUrl || photographerImageUrl}
              alt={content?.about?.title || "Retrato do Fotógrafo"}
              className="rounded-lg shadow-2xl object-cover w-full h-auto mx-auto max-w-sm md:max-w-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}