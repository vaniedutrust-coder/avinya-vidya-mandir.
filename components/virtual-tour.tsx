export function VirtualTour() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/10 shadow-lift">
      <div className="relative aspect-[16/10] min-h-[430px] w-full bg-brand-navy">
        <iframe
          src="https://avinyaschool.dharamgraphics.in/"
          title="Avinya Vidya Mandir 360° Virtual Tour"
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allow="fullscreen; accelerometer; gyroscope; autoplay"
          allowFullScreen
        />
      </div>
    </div>
  );
}
