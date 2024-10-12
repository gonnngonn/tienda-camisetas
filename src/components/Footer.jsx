import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} GCorp Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
