#!/usr/bin/env python3
"""
Thumbnail Generator for Virtual Photography Gallery
Recursively scans 'imgs/' directory and generates optimized thumbnails in 'thumbs/'
preserving the exact same folder hierarchy and filenames.
"""

import os
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from PIL import Image, ImageOps

# Configuration
SOURCE_DIR = "imgs"
TARGET_DIR = "thumbs"
MAX_WIDTH = 800       # Max thumbnail width in pixels (crisp for 2-4 columns & Retina)
MAX_HEIGHT = 800      # Max thumbnail height in pixels
PNG_OPTIMIZE = True
JPEG_QUALITY = 85
WEBP_QUALITY = 85
SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}

def get_base_dir():
    """Returns directory where this script is located."""
    return Path(__file__).resolve().parent

def generate_thumbnails(source_dir=SOURCE_DIR, target_dir=TARGET_DIR, max_w=MAX_WIDTH, max_h=MAX_HEIGHT):
    base_dir = get_base_dir()
    src_path = base_dir / source_dir
    dst_path = base_dir / target_dir

    if not src_path.exists():
        print(f"[ERROR] Source folder '{src_path}' does not exist.")
        return

    print("\n" + "=" * 55)
    print("  Virtual Photography - Thumbnail Generator")
    print(f"  Source: {src_path.relative_to(base_dir)}")
    print(f"  Target: {dst_path.relative_to(base_dir)}")
    print(f"  Max dimensions: {max_w}x{max_h}px")
    print("=" * 55 + "\n")

    total_found = 0
    generated_count = 0
    skipped_count = 0
    bytes_original_total = 0
    bytes_thumb_total = 0

    for root, _, files in os.walk(src_path):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue

            total_found += 1
            rel_path = file_path.relative_to(src_path)
            thumb_path = dst_path / rel_path

            # Create parent folder if not exists
            thumb_path.parent.mkdir(parents=True, exist_ok=True)

            orig_size = file_path.stat().st_size
            bytes_original_total += orig_size

            # Check if thumb exists and is newer than source
            if thumb_path.exists() and thumb_path.stat().st_mtime >= file_path.stat().st_mtime:
                skipped_count += 1
                bytes_thumb_total += thumb_path.stat().st_size
                continue

            try:
                with Image.open(file_path) as img:
                    # Auto-orient based on EXIF
                    img = ImageOps.exif_transpose(img)

                    # Calculate target thumbnail size maintaining aspect ratio
                    img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)

                    ext = file_path.suffix.lower()
                    if ext in {".jpg", ".jpeg"}:
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        img.save(thumb_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
                    elif ext == ".png":
                        if img.mode not in ("RGB", "RGBA"):
                            img = img.convert("RGBA")
                        img.save(thumb_path, "PNG", optimize=PNG_OPTIMIZE)
                    elif ext == ".webp":
                        img.save(thumb_path, "WEBP", quality=WEBP_QUALITY)
                    else:
                        img.save(thumb_path)

                thumb_size = thumb_path.stat().st_size
                bytes_thumb_total += thumb_size
                savings = (1 - (thumb_size / orig_size)) * 100 if orig_size > 0 else 0
                generated_count += 1
                print(f"  [CREATED] {rel_path} ({orig_size / 1024:.1f} KB -> {thumb_size / 1024:.1f} KB, -{savings:.1f}%)")

            except Exception as e:
                print(f"  [FAILED] {rel_path}: {e}")

    print("\n" + "-" * 55)
    print("  Done!")
    print(f"  Total images scanned: {total_found}")
    print(f"  Thumbnails generated: {generated_count}")
    print(f"  Thumbnails up-to-date (skipped): {skipped_count}")
    if total_found > 0:
        saved_mb = (bytes_original_total - bytes_thumb_total) / (1024 * 1024)
        print(f"  Total space saved: {saved_mb:.2f} MB")
    print("-" * 55 + "\n")

if __name__ == "__main__":
    generate_thumbnails()
