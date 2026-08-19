from __future__ import annotations

import re
from email import policy
from email.parser import BytesParser
from pathlib import Path


def safe_filename(s: str) -> str:
    s = s.strip()
    s = s.replace("<", "").replace(">", "")
    s = re.sub(r"[^a-zA-Z0-9._-]+", "_", s)
    return s or "image"


def main() -> None:
    # Source from the plan / user context.
    eml_path = Path(r"c:\Users\PavanPatel\Downloads\AviLease Fabric demo suggestions.eml")
    out_dir = Path("tmp/keran-eml-images")
    out_dir.mkdir(parents=True, exist_ok=True)

    if not eml_path.exists():
        raise FileNotFoundError(f"EML not found: {eml_path}")

    msg = BytesParser(policy=policy.default).parse(eml_path.open("rb"))

    extracted = 0
    for part in msg.walk():
        content_type = part.get_content_type()
        if not content_type:
            continue

        maintype = content_type.split("/")[0].lower()
        if maintype != "image":
            continue

        # Inline images are usually referenced via Content-ID (cid:...).
        content_id = part.get("Content-ID") or part.get("Content-Id")
        if not content_id:
            continue

        payload = part.get_payload(decode=True)
        if not payload:
            continue

        subtype = content_type.split("/")[-1].split(";")[0].strip()
        subtype = subtype.lower() if subtype else "img"
        ext = subtype
        cid = safe_filename(content_id)

        out_path = out_dir / f"{cid}.{ext}"
        # Avoid overwriting if the same Content-ID appears multiple times.
        if out_path.exists():
            extracted += 1
            continue

        out_path.write_bytes(payload)
        extracted += 1

    print(f"Extracted {extracted} inline image(s) into: {out_dir.resolve()}")


if __name__ == "__main__":
    main()

