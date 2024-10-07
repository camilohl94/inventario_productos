import './Header.css'
const Header = () => {
  const userName = localStorage.getItem("userName")
  return (
    <header>
      <h1>Sistema de Inventario</h1>
      <p>Bienvenido, {userName}</p>
    </header>
  );
};
export default Header;
