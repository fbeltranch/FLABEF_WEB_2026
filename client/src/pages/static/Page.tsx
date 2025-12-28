import { useStore } from '@/lib/mock-store';
import { useRoute } from 'wouter';
import NotFound from '@/pages/not-found';

export default function Page() {
  const [match, params] = useRoute('/page/:slug');
  const slug = params?.slug as string | undefined;
  const pages = useStore(state => (state as any).pages || {});

  if (!slug) return <NotFound />;
  const page = pages[slug];
  if (!page) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">{page.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
