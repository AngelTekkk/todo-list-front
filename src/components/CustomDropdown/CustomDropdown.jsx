import React, { useState, useRef, useEffect } from "react";
import Button from "../Button/Button.jsx";
import s from "./CustomDropdown.module.scss";

function CustomSelect({ value, options = [], onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);


    return (
        <div className={s.customSelect} ref={ref}>
            <Button
                type="button"
                className={s.customSelectButton}
                onClick={() => setOpen((o) => !o)}
            >
                {selectedOption ? selectedOption.label : ""}
                <span className={s.dropdownIcon}>{open ? "☰" : "☰"}</span>
            </Button>


            {open && (
                <div className={s.customSelectOptions}>
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`${s.customSelectOption} ${opt.value === value ? s.selected : ""}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            <div className={s.optionLabel}>{opt.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;
