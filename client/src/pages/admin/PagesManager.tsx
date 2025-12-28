import React, { useState } from 'react';
import { useStore } from '@/lib/mock-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function PagesManager() {
  const pages = useStore(s => s.pages);
  const updatePage = useStore(s => s.updatePage);
  const deletePage = useStore(s => s.deletePage);
  const { toast } = useToast();

  const [selected, setSelected] = useState<string | null>(Object.keys(pages)[0] || null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  React.useEffect(() => {
    if (selected) {
      const p = pages[selected];
      setTitle(p?.title || '');
      setContent(p?.content || '');
    }
  }, [selected, pages]);

  if (!selected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Páginas</h2>
        <p>No hay páginas configuradas.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!selected) return;
    updatePage(selected, { title: title || pages[selected].title, content });
    toast({ title: 'Guardado', description: 'La página se ha actualizado correctamente.' });
  };

  const handleDelete = () => {
    if (!selected) return;
    deletePage(selected);
    setSelected(Object.keys(pages).filter(s => s !== selected)[0] || null);
    toast({ title: 'Eliminado', description: 'La página ha sido eliminada.' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="w-1/4 border-r pr-4">
          <h3 className="font-semibold mb-3">Páginas</h3>
          <div className="flex flex-col gap-2">
            {Object.values(pages).map(p => (
              <Button key={p.slug} variant={p.slug === selected ? 'secondary' : 'outline'} size="sm" onClick={() => setSelected(p.slug)}>
                {p.title}
              </Button>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Editar: {pages[selected].title}</h2>

          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Título</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Contenido (HTML permitido)</span>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
            </label>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Guardar</Button>
              <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
