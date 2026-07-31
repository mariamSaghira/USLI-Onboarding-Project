namespace GroceryStoreAPI.Models
{
    // A request to process a customer checkout.
    // Contains a collection of items being purchased.
    public class CheckoutRequest
    {
        // Gets and sets the list of items included in the checkout request.
        public List<CheckoutItem> Items { get; set; } = new();
    }
}
