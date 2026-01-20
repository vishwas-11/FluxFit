type Props = {
  title: string;
  thumbnail: string;
  videoId: string;
};

export default function YouTubeCard({ title, thumbnail, videoId }: Props) {
  const handleClick = () => {
    window.open(
      `https://www.youtube.com/watch?v=${videoId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl overflow-hidden bg-gray-900 hover:scale-105 transition"
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-white font-semibold line-clamp-2">
          {title}
        </p>
      </div>
    </div>
  );
}
