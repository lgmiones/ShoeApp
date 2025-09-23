namespace ShoeShopAPI.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int ShoeId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        public Shoe Shoe { get; set; } = null!;
    }
}
