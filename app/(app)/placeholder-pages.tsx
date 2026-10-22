import { EmptyState, PageHeader } from '@/components/shared'

export function FeaturePage({ title, description }: { title: string; description: string }) { return <div className="mx-auto flex max-w-7xl flex-col gap-8"><PageHeader title={title} description={description} /><EmptyState title="Área preparada" description="A estrutura desta área está pronta para receber os dados e fluxos da API." /></div> }
