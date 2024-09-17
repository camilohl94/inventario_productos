const Dashboard = () => {
  return (
    <section id="dashboard" className="content-section active">
      <div className="cards">
        <div className="card">
          <div className="card-info">
            <h3>Total de Productos</h3>
            <p>150</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-boxes"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-info">
            <h3>Entradas Hoy</h3>
            <p>20</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-arrow-down"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-info">
            <h3>Salidas Hoy</h3>
            <p>5</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-arrow-up"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-info">
            <h3>Productos Bajos en Stock</h3>
            <p>8</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Dashboard;
