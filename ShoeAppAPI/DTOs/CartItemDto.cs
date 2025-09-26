namespace ShoeShopAPI.DTOs
{
    public class CartItemDto
    {
        public int ShoeId { get; set; }
        public int Quantity { get; set; }
        public string Name { get; set; } = "";     // safe default for output
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }      // optional thumbnail
    }
}
