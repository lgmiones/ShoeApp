namespace ShoeShopAPI.DTOs
{
    public class OrderItemDto
    {
        public int ShoeId { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Brand { get; set; } = string.Empty;
        public string? ImageUrl { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
