export function VirtualTour() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-brand-navy shadow-soft">
      <div className="aspect-[16/10] min-h-[420px] w-full">
        <iframe
          src="https://avinyaschool.dharamgraphics.in/"
          title="Avinya Vidya Mandir 360° Virtual Tour"
          className="h-full w-full border-0"
          loading="lazy"
          allow="fullscreen; accelerometer; gyroscope; autoplay"
          allowFullScreen
        />
      </div>
    </div>
  );
}
