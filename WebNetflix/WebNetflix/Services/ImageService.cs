using SkiaSharp;
using WebNetflix.Interfaces;

namespace WebNetflix.Services;

public class ImageService(IConfiguration configuration) : IImageService
{
    public async Task DeleteImageAsync(string name)
    {
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();
        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);

        Task[] tasks = sizes
            .AsParallel()
            .Select(size =>
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(dir, $"{size}_{name}");
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                });
            })
            .ToArray();

        await Task.WhenAll(tasks);
    }

    public async Task<string> SaveImageFromUrlAsync(string imageUrl)
    {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        return await SaveImageAsync(imageBytes);
    }

    public async Task<string> SaveImageAsync(IFormFile file)
    {
        using MemoryStream ms = new();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        var imageName = await SaveImageAsync(bytes);
        return imageName;
    }

    private async Task<string> SaveImageAsync(byte[] bytes)
    {
        string imageName = $"{Path.GetRandomFileName()}.webp";
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        Task[] tasks = sizes
            .AsParallel()
            .Select(s => SaveImageAsync(bytes, imageName, s))
            .ToArray();

        await Task.WhenAll(tasks);

        return imageName;
    }

    public async Task<string> SaveImageFromBase64Async(string input)
    {
        var base64Data = input.Contains(",")
           ? input.Substring(input.IndexOf(",") + 1)
           : input;

        byte[] imageBytes = Convert.FromBase64String(base64Data);

        return await SaveImageAsync(imageBytes);
    }

    private Task SaveImageAsync(byte[] bytes, string name, int size)
    {
        return Task.Run(() =>
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!,
                $"{size}_{name}");

            using var original = SKBitmap.Decode(bytes)
                ?? throw new InvalidOperationException("Не вдалося декодувати зображення.");

            // Аналог ResizeMode.Max: вписуємо у size x size, зберігаючи пропорції, без апскейлу
            var scale = Math.Min((double)size / original.Width, (double)size / original.Height);
            if (scale > 1) scale = 1;

            var newWidth = Math.Max(1, (int)Math.Round(original.Width * scale));
            var newHeight = Math.Max(1, (int)Math.Round(original.Height * scale));

            using var resized = original.Resize(
                new SKImageInfo(newWidth, newHeight),
                new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.None))
                ?? throw new InvalidOperationException("Не вдалося змінити розмір зображення.");

            using var image = SKImage.FromBitmap(resized);
            using var data = image.Encode(SKEncodedImageFormat.Webp, 90); // 90 — якість, налаштуй за потреби

            using var fs = File.OpenWrite(path);
            data.SaveTo(fs);
        });
    }
}