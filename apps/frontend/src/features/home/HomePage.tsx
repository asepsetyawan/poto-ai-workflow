import { FeatureCarousel } from '@/features/home/components/FeatureCarousel';
import { FeaturedBanner } from '@/features/home/components/FeaturedBanner';
import { InspirationGallery } from '@/features/home/components/InspirationGallery';
import { ModelGrid } from '@/features/home/components/ModelGrid';
import { PromptDock } from '@/features/home/components/PromptDock';

export function HomePage() {
  return (
    <div className="animate-fade-in bg-studio-950 text-studio-50 motion-reduce:animate-none">
      <FeatureCarousel />
      <FeaturedBanner />
      <ModelGrid />
      <InspirationGallery />
      <PromptDock />
    </div>
  );
}
