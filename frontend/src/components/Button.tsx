import React from 'react';
import '../assets/styles/components/button.css'; // Import your CSS styles

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    name: string;
}

const Button: React.FC<ButtonProps> = ({ label, name,...props }) => {
    return (
        <button
            className={
            label === "btn-back"
                ? "btn-back"
                : label === "btn-submit"
                ? "btn-submit"
                : label === "btn-cancel"
                ? "btn-cancel"
                : label === "btn-card"
                ? "btn-card"
                : label === "btn-back"
                ? "btn-back"
                : label === "btn-submit"
                ? "btn-submit"
                : label === "btn-cancel"
                ? "btn-cancel"
                : ""
            }
            {...props}
        >
            {name}
        </button>
    );
};

export default Button;