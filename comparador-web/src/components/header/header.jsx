import React from "react";
import "./header.css";
import { BiSolidHelpCircle } from "react-icons/bi";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

const Header = () => {
  const itemStyle = {
    display: "block",
    padding: "8px 12px",
    textDecoration: "none",
    color: "#333",
    fontSize: "14px",
  };

  return (
    <div className="header">
      <div className="logo-header">
        <img
          src="https://redeprimavera.com.br/wp-content/uploads/2024/04/cropped-Nova-Logo.png"
          alt=""
        />
        <p>
          <strong>
            REDE
            <br />
            PRIMAVERA
            <br />
            SAÚDE
          </strong>
        </p>
      </div>

      <Link to="/">
        <h1>FAME</h1>
      </Link>

      <div className="nav-bar">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            style={{
              backgroundColor: "var(--cor-secundaria)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Informações <BiSolidHelpCircle />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "4px",
              minWidth: "160px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 10,
            }}
          >
            <DropdownMenu.Item asChild>
              <Link to="/info-comparador" style={itemStyle}>
                Compararar planilhas
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link to="/info-celulas-vazias" style={itemStyle}>
                Valores faltantes
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link to="/info-duplicatas" style={itemStyle}>
                Detectar duplicatas
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link to="/info-uniao" style={itemStyle}>
                União inteligente
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default Header;
