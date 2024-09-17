const Reportes=()=>{
    return(
        <section id="reports" className="content-section">
                <h2>Generar Reportes</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="report-type">Tipo de Reporte:</label>
                        <select id="report-type" required>
                            <option value="">Seleccione un reporte</option>
                            <option value="bajo-stock">Productos con Bajo Stock</option>
                            <option value="movimientos">Movimientos Recientes</option>
                            <option value="general">Reporte General</option>
                        </select>
                    </div>
                    <button type="submit">Generar Reporte</button>
                </form>
                
                <div className="report-result">
                    <h3>Resultado del Reporte</h3>
                    <p>No hay datos para mostrar.</p>
                </div>
            </section>
    )
}
export default Reportes