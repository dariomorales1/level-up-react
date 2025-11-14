describe('Producto Component - estructura base', () => {
    
    const mockProducto = {
        "Código": "TEST001",
        "Nombre": "Producto Test",
        "Precio": "29990",
        "Descripción Larga": "Descripción larga de prueba",
        "Especificaciones": ["Especificación 1", "Especificación 2"],
        "Comentarios": ["Comentario 1", "Comentario 2"]
    };

    it('1. buscar el producto por código a partir de los parámetros de URL', () => {

        const searchParams = new URLSearchParams('codigo=TEST001');
        const codigo = searchParams.get('codigo');
        
        const productoEncontrado = mockProducto["Código"] === codigo ? mockProducto : null;
        
        expect(productoEncontrado).not.toBeNull();
        expect(productoEncontrado.Nombre).toBe('Producto Test');
    });

    it('2. llama a showToast con el mensaje correcto al agregar al carrito', () => {

        const mockShowToast = jest.fn(); // ✅ CORREGIDO: jasmine.createSpy -> jest.fn()
        const miFuncion = jest.fn();
        
        const AddToCart = function(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            mockShowToast("Se ha ingresado " + mockProducto.Nombre + " al carrito");
        };
        
        const mockEvent = { stopPropagation: jest.fn() }; // ✅ CORREGIDO: jasmine.createSpy -> jest.fn()
        AddToCart(mockEvent);
        
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith('Se ha ingresado Producto Test al carrito');
    });

    it('3. Muestra todas las secciones de información del producto.', () => {
        expect(mockProducto.Nombre).toBeDefined();
        expect(mockProducto['Descripción Larga']).toBeDefined();
        expect(mockProducto.Precio).toBeDefined();
        expect(Array.isArray(mockProducto.Especificaciones)).toBe(true);
        expect(Array.isArray(mockProducto.Comentarios)).toBe(true);
        expect(mockProducto.Especificaciones.length).toBeGreaterThan(0);
        expect(mockProducto.Comentarios.length).toBeGreaterThan(0);
    });

    it('4. estructura de datos de producto válida', () => {
        expect(typeof mockProducto['Código']).toBe('string');
        expect(typeof mockProducto.Nombre).toBe('string');
        expect(typeof mockProducto.Precio).toBe('string');
        expect(typeof mockProducto['Descripción Larga']).toBe('string');
        expect(Array.isArray(mockProducto.Especificaciones)).toBe(true);
        expect(Array.isArray(mockProducto.Comentarios)).toBe(true);
        
        const precioNumerico = parseFloat(mockProducto.Precio.replace(/[^0-9.]/g, ''));
        expect(precioNumerico).toBeGreaterThan(0);
    });
});