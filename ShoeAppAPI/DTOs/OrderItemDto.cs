namespace ShoeShopAPI.DTOs
{
    public class OrderItemDto
    {
        public int ShoeId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
