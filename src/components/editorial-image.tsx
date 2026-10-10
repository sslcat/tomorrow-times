import Image from "next/image";
import { resolveEditorialImage } from "@/lib/editorial-images";

export function EditorialImage({
  id,
  label,
  section = "entertainment",
  hero = false,
}: {
  id: string;
  label: string;
  section?: string;
  hero?: boolean;
}) {
  const asset = resolveEditorialImage(id);
  return asset.status === "approved" && asset.src ? (
    <div
      className={`image-frame image-${section}`}
      data-image-status={asset.status}
    >
      <Image
        className="editorial-art"
        src={asset.src}
        alt={asset.alt}
        width={1600}
        height={1000}
        sizes={
          hero
            ? "(max-width: 800px) 100vw, 70vw"
            : "(max-width: 580px) 100vw, (max-width: 1100px) 50vw, 33vw"
        }
        preload={hero}
        unoptimized
        style={{
          objectPosition: `${asset.focalPoint[0]}% ${asset.focalPoint[1]}%`,
        }}
      />
      <span className="art-label">Original illustration</span>
    </div>
  ) : (
    <div
      className={`editorial-art type-art image-${section}`}
      data-image-status={asset.status}
      role="img"
      aria-label={`${label}. Typographic illustration; scene artwork pending.`}
    >
      <span className="type-orbit" aria-hidden="true" />
      <span className="type-art-label">THE TOMORROW TIMES / {section}</span>
      <strong>
        {asset.treatmentLabel ||
          (asset.entityType === "entity" ? label : "FROM THE REACH")}
      </strong>
      <span className="art-label">Typographic illustration</span>
    </div>
  );
}
export function Portrait({
  id,
  name,
  large = false,
}: {
  id: string;
  name: string;
  large?: boolean;
}) {
  const asset = resolveEditorialImage(id);
  const initials = name
    .split(/[ -]/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  // A future approved portrait uses the same manifest; pending files cannot render.
  return (
    <div className={`portrait portrait-${id} ${large ? "portrait-large" : ""}`}>
      {asset.status === "approved" &&
      asset.entityType === "character" &&
      asset.src ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          width={480}
          height={600}
          unoptimized
          style={{
            objectPosition: `${asset.focalPoint[0]}% ${asset.focalPoint[1]}%`,
          }}
        />
      ) : (
        <>
          <span className="portrait-orbit" aria-hidden="true" />
          <span className="portrait-initials" aria-hidden="true">
            {initials}
          </span>
          <span className="portrait-label">
            {large
              ? "IDENTITY MONOGRAM / PORTRAIT PENDING"
              : "IDENTITY MONOGRAM"}
          </span>
        </>
      )}
    </div>
  );
}
