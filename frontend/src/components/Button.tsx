import React from 'react';
import '../assets/styles/components/button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    name: string;
    startIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, name, startIcon, ...props }) => {
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
                    : ""
            }
            {...props}
        >
            {startIcon}
            {name}
        </button>
    );
};

export default Button;
