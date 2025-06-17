
interface YouTubeEmbedProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export const YouTubeEmbed = ({ 
  videoId, 
  autoplay = false, 
  muted = true, 
  loop = false, 
  className = "" 
}: YouTubeEmbedProps) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    loop: loop ? '1' : '0',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    playlist: loop ? videoId : '',
  }).toString()}`;

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <iframe
        src={embedUrl}
        title="Product Demo"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
