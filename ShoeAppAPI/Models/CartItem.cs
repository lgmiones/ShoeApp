namespace ShoeShopAPI.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int ShoeId { get; set; }
        public int Quantity { get; set; }

        public Shoe Shoe { get; set; } = null!;
    }
}
