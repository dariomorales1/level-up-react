// src/demo-logic.spec.js
describe('Demo Tests - Business Logic', () => {
    
    it('should validate product search functionality', () => {
        const productos = [
            { "Código": "JM001", "Nombre": "Catan", "Precio": "29990" },
            { "Código": "JM002", "Nombre": "Carcassonne", "Precio": "24990" },
            { "Código": "JM003", "Nombre": "Dixit", "Precio": "22990" }
        ];

        const codigoBuscado = "JM002";
        const productoEncontrado = productos.find(p => p["Código"] === codigoBuscado);
        
        expect(productoEncontrado).toBeDefined();
        expect(productoEncontrado.Nombre).toBe('Carcassonne');
        expect(productoEncontrado.Precio).toBe('24990');
    });

    it('should handle cart item addition logic', () => {
        const cart = { items: [] };
        const newProduct = { id: "TEST001", name: "Test Product", price: "19990", quantity: 1 };
        
        // Simular ADD_TO_CART
        cart.items.push(newProduct);
        
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].name).toBe('Test Product');
        expect(cart.items[0].quantity).toBe(1);
    });

    it('should calculate cart total correctly', () => {
        const cartItems = [
            { price: "19990", quantity: 2 },
            { price: "24990", quantity: 1 }
        ];

        const subtotal = cartItems.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);

        expect(subtotal).toBe(19990 * 2 + 24990 * 1);
        expect(subtotal).toBe(64970);
    });
});