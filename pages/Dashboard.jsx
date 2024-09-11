const Dashboard = () => {
  return (
    <section id="dashboard" class="content-section active">
      <div class="cards">
        <div class="card">
          <div class="card-info">
            <h3>Total de Productos</h3>
            <p>150</p>
          </div>
          <div class="card-icon">
            <i class="fas fa-boxes"></i>
          </div>
        </div>
        <div class="card">
          <div class="card-info">
            <h3>Entradas Hoy</h3>
            <p>20</p>
          </div>
          <div class="card-icon">
            <i class="fas fa-arrow-down"></i>
          </div>
        </div>
        <div class="card">
          <div class="card-info">
            <h3>Salidas Hoy</h3>
            <p>5</p>
          </div>
          <div class="card-icon">
            <i class="fas fa-arrow-up"></i>
          </div>
        </div>
        <div class="card">
          <div class="card-info">
            <h3>Productos Bajos en Stock</h3>
            <p>8</p>
          </div>
          <div class="card-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Dashboard;
