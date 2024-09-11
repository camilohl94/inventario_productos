const Registros = () => {
  return (
    <section id="register" className="content-section">
      <h2>Registrar Nuevo Producto</h2>
      <form>
        <div className="form-group">
          <label htmlFor="product-name" >
            Nombre del Producto:
          </label>
          <input type="text" id="product-name" required />
        </div>
        <div className="form-group">
          <label htmlFor="category" >
            Categoría:
          </label>
          <input type="text" id="category" required />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">
            Cantidad:
          </label>
          <input type="number" id="quantity" required />
        </div>
        <div className="form-group">
          <label htmlFor="price">
            Precio:
          </label>
          <input type="number" id="price" step="0.01" required />
        </div>
        <button type="submit">Registrar Producto</button>
      </form>
    </section>
  );
};

export default Registros
