from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import numpy as np

# символы от плотных к пустым
ASCII_CHARS = "@#W$9876543210?!abc;:+=-,._ "
ASCII_CHARS = ASCII_CHARS[::-1]

# ANSI цвета терминала
NEON_BLUE = "\033[96m"
WHITE = "\033[97m"
RESET = "\033[0m"


def preprocess_image(path, new_width=70):
    img = Image.open(path)

    # grayscale
    img = ImageOps.grayscale(img)

    # контраст + резкость
    img = ImageEnhance.Contrast(img).enhance(3.0)
    img = ImageEnhance.Sharpness(img).enhance(2.0)

    # выделяем жесткие белые грани
    edges = img.filter(ImageFilter.FIND_EDGES)
    edges = ImageEnhance.Contrast(edges).enhance(5.0)

    # базовое изображение приглушаем — это будет наш кибер-синий "заполнитель"
    base = img.point(lambda p: p * 0.6)

    # смешиваем через сложение, чтобы края буквально "горели" поверх базы
    base_arr = np.array(base, dtype=np.uint16)
    edges_arr = np.array(edges, dtype=np.uint16)
    combined = np.clip(base_arr + edges_arr, 0, 255).astype(np.uint8)
    img = Image.fromarray(combined)

    # чистим фон от шума, чтобы черный оставался черным
    img = img.point(lambda p: 0 if p < 35 else p)

    # коррекция пропорций терминала (0.5 обычно лучше для мелкого шрифта консоли)
    aspect_ratio = 0.5
    new_height = int(aspect_ratio * new_width * img.height / img.width)
    # Используем качественный ресайз, чтобы не терять пиксели
    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    return img


def pixel_to_char(pixel):
    return ASCII_CHARS[int(pixel) * len(ASCII_CHARS) // 256]


def detect_neon_zone(pixel):
    """
    Определяем где рисовать неон:
    Яркие пиксели > 180 (грани) = белые.
    Средние полутона 35-180 = неоновый синий.
    """
    return 35 <= pixel <= 180


def image_to_ascii(img):
    pixels = np.array(img)
    ascii_art = ""

    for row in pixels:
        for pixel in row:
            char = pixel_to_char(pixel)

            if char == " ":
                ascii_art += " "
            elif detect_neon_zone(pixel):
                ascii_art += NEON_BLUE + char + RESET
            else:
                ascii_art += WHITE + char + RESET

        ascii_art += "\n"

    return ascii_art


def save_ascii(ascii_art, filename="logo.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(ascii_art)


def main():
    img = preprocess_image("ascii.jpg", new_width=70)
    ascii_art = image_to_ascii(img)

    # печать в терминал
    print("\n")
    print(ascii_art)

    # сохранение в файл
    save_ascii(ascii_art)


if __name__ == "__main__":
    main()