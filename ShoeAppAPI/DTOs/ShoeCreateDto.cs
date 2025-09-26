namespace ShoeShopAPI.DTOs
{
    public class ShoeCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; } // ✅
    }
}
