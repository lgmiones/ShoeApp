namespace ShoeShopAPI.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int ShoeId { get; set; }
        public int Quantity { get; set; }

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public Shoe Shoe { get; set; } = null!;
    }
}
