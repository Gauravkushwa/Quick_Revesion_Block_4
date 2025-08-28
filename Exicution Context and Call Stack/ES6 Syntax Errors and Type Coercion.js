const checkout = {
    items: [],
    total: 0,
  
    addItem(item) {
      // Convert price to number if possible
      const price = parseFloat(item.price);
  
      if (isNaN(price)) {
        console.log(`Invalid price for item "${item.name}".`);
        return;
      }
  
      // Make sure price is non-negative (optional)
      if (price < 0) {
        console.log(`Price for "${item.name}" cannot be negative.`);
        return;
      }
  
      // Use validated price instead of original item.price
      this.items.push({ ...item, price });
      this.total += price;
  
      console.log(`Added "${item.name}" for $${price.toFixed(2)}.`);
    },
  
    getTotal() {
      // Return formatted total as string
      return `Total: $${this.total.toFixed(2)}`;
    }
  };
  
  // Usage examples
  checkout.addItem({ name: "Coffee Maker", price: "99.95" }); 
  checkout.addItem({ name: "Milk", price: 3.50 });            
  checkout.addItem({ name: "Invalid Item", price: "abc" });  
  console.log(checkout.getTotal()); 
  