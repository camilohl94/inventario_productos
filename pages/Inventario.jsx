const Inventario =()=>{
    return(
        <section id="inventory" class="content-section">
                <h2>Registrar Entrada/Salida</h2>
                <form>
                    <div class="form-group">
                        <label htmlFor="product-select">Producto:</label>
                        <select id="product-select" required>
                            <option value="">Seleccione un producto</option>
                            <option value="producto1">Producto 1</option>
                            <option value="producto2">Producto 2</option>
                            <option value="producto3">Producto 3</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label htmlFor="movement-type">Tipo de Movimiento:</label>
                        <select id="movement-type" required>
                            <option value="">Seleccione el tipo</option>
                            <option value="entrada">Entrada (Compra)</option>
                            <option value="salida">Salida (Venta)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label htmlFor="movement-quantity">Cantidad:</label>
                        <input type="number" id="movement-quantity" required/>
                    </div>
                    <button type="submit">Registrar Movimiento</button>
                </form>
            </section>
    )
}

export default Inventario