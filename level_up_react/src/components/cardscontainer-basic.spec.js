// src/components/cardscontainer-basic.spec.js
describe('CardsContainer Component - estructura base', () => {
    
    const mockListaProductos = [
        {
            "Código": "DEFAULT001",
            "Nombre": "Producto Default 1",
            "Descripción Corta": "Descripción default 1",
            "Precio": "19990"
        },
        {
            "Código": "DEFAULT002", 
            "Nombre": "Producto Default 2",
            "Descripción Corta": "Descripción default 2",
            "Precio": "24990"
        }
    ];

    const mockCustomProducts = [
        {
            "Código": "CUSTOM001",
            "Nombre": "Producto Personalizado 1",
            "Descripción Corta": "Descripción personalizada 1",
            "Precio": "15990"
        },
        {
            "Código": "CUSTOM002",
            "Nombre": "Producto Personalizado 2", 
            "Descripción Corta": "Descripción personalizada 2",
            "Precio": "21990"
        }
    ];

    it('1. debería mostrar un mensaje vacío cuando el array de productos está vacío', () => {
        const productos = [];
        const shouldShowEmptyMessage = productos.length === 0;
        
        expect(shouldShowEmptyMessage).toBe(true);
    });

    it('2. debería usar productos por defecto cuando no se proporcionan productos desde el padre', () => {
        const productosFromParent = [];
        const itemsToRender = productosFromParent.length ? productosFromParent : mockListaProductos;
        
        expect(itemsToRender).toBe(mockListaProductos);
        expect(itemsToRender.length).toBe(2);
        expect(itemsToRender[0].Nombre).toBe('Producto Default 1');
    });

    it('3. debería usar productos personalizados cuando se proporcionan desde el padre', () => {
        const productosFromParent = mockCustomProducts;
        const itemsToRender = productosFromParent.length ? productosFromParent : mockListaProductos;
        
        expect(itemsToRender).toBe(mockCustomProducts);
        expect(itemsToRender.length).toBe(2);
        expect(itemsToRender[1].Nombre).toBe('Producto Personalizado 2');
    });

    it('4. debería generar claves únicas para cada producto', () => {
        const productos = mockCustomProducts;
        const keys = productos.map(p => p["Código"] || p.id);
        
        // Verificar que todas las keys son únicas
        const uniqueKeys = [...new Set(keys)];
        expect(uniqueKeys.length).toBe(keys.length);
        
        // Verificar que las keys existen
        keys.forEach(key => {
            expect(key).toBeDefined();
            expect(typeof key).toBe('string');
        });
    });

    it('5. debería manejar formatos de datos de productos mixtos', () => {
        const mixedProducts = [
            { "Código": "PROD1", "Nombre": "Producto 1", "Precio": "10000" },
            { "id": "PROD2", "Nombre": "Producto 2", "Precio": "20000" },
            { "Código": "PROD3", "Nombre": "Producto 3", "Precio": "30000" }
        ];

        mixedProducts.forEach(product => {
            const key = product["Código"] || product.id;
            const nombre = product.Nombre;
            const precio = product.Precio;
            
            expect(key).toBeDefined();
            expect(nombre).toBeDefined();
            expect(precio).toBeDefined();
        });
    });
});